import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Header, SignatureBlock, MetaBox, Rgpd } from "./components";
import { fullName, type PartnerData } from "../schemas";

const variantTitle: Record<PartnerData["variant"], string> = {
  institutional: "Variante 1 — Partenaire institutionnel ou associatif",
  professional: "Variante 2 — Professionnel (éducation, santé, social, culture)",
  economic: "Variante 3 — Acteur économique, producteur local, artisan",
};

const objet: Record<PartnerData["variant"], string> = {
  institutional: "Lettre de soutien au projet du tiers-lieu Sion Émergence.",
  professional: "Lettre de soutien au projet du tiers-lieu Sion Émergence.",
  economic: "Soutien au projet du tiers-lieu Sion Émergence et intention de partenariat.",
};

export function PartnerPdf(props: {
  data: PartnerData;
  submissionId: string;
  signatureDataUri?: string;
  signedAt?: string;
  ip?: string;
  hash?: string;
}) {
  const { data } = props;
  const signerName = fullName(data.signerFirstName, data.signerLastName);
  return (
    <Document
      title={`Lettre de soutien — ${data.organizationName}`}
      author="Sion Émergence"
    >
      <Page size="A4" style={styles.page}>
        <Header />

        <Text style={[styles.subtitle, { fontFamily: "Helvetica-Bold", marginBottom: 4 }]}>
          {variantTitle[data.variant]}
        </Text>
        <Text style={[styles.subtitle, { marginBottom: 16 }]}>
          [En-tête du signataire]
        </Text>

        <Text style={{ marginBottom: 16 }}>
          {data.city}, le {data.signedDate}
        </Text>

        <Text style={[styles.paragraph, { fontFamily: "Helvetica-Bold" }]}>
          Objet : {objet[data.variant]}
        </Text>

        <Text style={styles.paragraph}>Madame, Monsieur,</Text>

        <PartnerBody data={data} />

        <Text style={styles.paragraph}>
          Nous vous prions d&apos;agréer, Madame, Monsieur, l&apos;expression de nos sentiments
          respectueux.
        </Text>

        <View style={{ marginTop: 18 }}>
          <Text>{signerName}</Text>
          <Text style={{ fontSize: 9, color: "#5C5C5C" }}>
            {data.signerRole} — {data.organizationName}
          </Text>
        </View>

        <SignatureBlock
          city={data.city}
          date={data.signedDate}
          signerName={signerName}
          signatureSvgDataUri={props.signatureDataUri}
        />

        <MetaBox
          submissionId={props.submissionId}
          signedAt={props.signedAt}
          ip={props.ip}
          hash={props.hash}
        />

        <Rgpd scope="partenariat avec le tiers-lieu" />
      </Page>
    </Document>
  );
}

function PartnerBody({ data }: { data: PartnerData }) {
  if (data.variant === "institutional") {
    return (
      <>
        <Text style={styles.paragraph}>
          {data.organizationName}, représentée par {fullName(data.signerFirstName, data.signerLastName)}, {data.signerRole}, a
          pris connaissance du projet du tiers-lieu Sion Émergence, porté au Lamentin par
          Olivier-Marie LUCENAY et Karla LUCENAY, cofondateurs. Ce projet associe école
          primaire, pôle périscolaire, accompagnement à la parentalité, jardin pédagogique et
          service traiteur écoresponsable.
        </Text>
        <Text style={styles.paragraph}>
          Nous saluons la cohérence de cette démarche, qui répond à plusieurs enjeux
          identifiés : diversification de l&apos;offre éducative, valorisation de l&apos;identité
          martiniquaise, soutien aux familles et ancrage d&apos;une économie circulaire. Par la
          présente, nous apportons notre soutien au projet et nous engageons à {data.commitment}.
        </Text>
      </>
    );
  }
  if (data.variant === "professional") {
    return (
      <>
        <Text style={styles.paragraph}>
          Professionnel(le) {data.profession} exerçant {data.practiceContext}, je soutiens le
          projet du tiers-lieu Sion Émergence, porté au Lamentin par Olivier-Marie LUCENAY et
          Karla LUCENAY, cofondateurs.
        </Text>
        <Text style={styles.paragraph}>
          Dans ma pratique, je constate {data.observation}. La démarche portée par Sion
          Émergence — pédagogie Freinet et Design for Change, excellence caribéenne, tiers-lieu
          intégré — me paraît particulièrement pertinente.
        </Text>
        <Text style={styles.paragraph}>
          J&apos;apporte mon soutien au projet et me tiens disponible pour {data.availability}.
        </Text>
      </>
    );
  }
  // economic
  return (
    <>
      <Text style={styles.paragraph}>
        {data.organizationName}, représentée par {fullName(data.signerFirstName, data.signerLastName)}, {data.signerRole},
        exerce une activité de {data.activity} sur le territoire {data.territory}. Nous
        soutenons le projet du tiers-lieu Sion Émergence, porté au Lamentin par Olivier-Marie
        LUCENAY et Karla LUCENAY, cofondateurs.
      </Text>
      <Text style={styles.paragraph}>
        Nous souscrivons pleinement à sa démarche de circuit court et d&apos;économie
        circulaire. Nous exprimons par la présente une intention de partenariat opérationnel à
        sa mise en œuvre : {data.partnership}.
      </Text>
      <Text style={styles.paragraph}>
        Nous espérons que ce projet trouvera les appuis institutionnels et financiers à la
        hauteur de son ambition pour le territoire martiniquais.
      </Text>
    </>
  );
}
