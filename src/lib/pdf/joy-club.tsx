import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Header, Field, SignatureBlock, MetaBox, Rgpd, Checkbox } from "./components";
import { fullName, formatAddress, type JoyClubData } from "../schemas";

export function JoyClubPdf(props: {
  data: JoyClubData;
  submissionId: string;
  signatureDataUri?: string;
  signedAt?: string;
  ip?: string;
  hash?: string;
}) {
  const { data } = props;
  const guardianName = fullName(data.guardianFirstName, data.guardianLastName);
  const address = formatAddress(
    data.addressStreet,
    data.addressPostalCode,
    data.addressCity,
  );
  return (
    <Document
      title={`Joy Club · Lettre d'intention · ${guardianName}`}
      author="Sion Émergence"
    >
      <Page size="A4" style={styles.page}>
        <Header />

        <Text style={styles.title}>Lettre d&apos;intention d&apos;inscription · Joy Club</Text>
        <Text style={styles.subtitle}>
          Pôle périscolaire et loisirs du tiers-lieu Sion Émergence. Ouverture prévue :
          septembre 2026.
        </Text>

        <Text style={styles.section}>Responsable(s) légal(aux)</Text>
        <Field label="Nom et prénom" value={guardianName} />
        <Field label="Adresse postale" value={address} />
        <Field label="Téléphone" value={data.phone} />
        <Field label="Courriel" value={data.email} />

        <Text style={styles.section}>Enfant(s) concerné(s) et services souhaités</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={[styles.th, { flex: 2 }]}>Nom et prénom</Text>
            <Text style={[styles.th, { flex: 0.7 }]}>Âge</Text>
            <Text style={styles.th}>Centre aéré (vacances)</Text>
            <Text style={styles.th}>Garderie du mercredi</Text>
            <Text style={[styles.th, { borderRightWidth: 0 }]}>Soutien scolaire</Text>
          </View>
          {data.children.map((c, i) => {
            const isLast = i === data.children.length - 1;
            return (
              <View key={i} style={isLast ? styles.trLast : styles.tr}>
                <Text style={[styles.td, { flex: 2 }]}>
                  {fullName(c.firstName, c.lastName)}
                </Text>
                <Text style={[styles.td, { flex: 0.7 }]}>{c.age}</Text>
                <View style={styles.tdCheck}>
                  <Checkbox checked={c.centreAere} />
                </View>
                <View style={styles.tdCheck}>
                  <Checkbox checked={c.garderieMercredi} />
                </View>
                <View style={[styles.tdCheck, { borderRightWidth: 0 }]}>
                  <Checkbox checked={c.soutienScolaire} />
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.section}>Déclaration d&apos;intention</Text>
        <Text style={styles.paragraph}>
          Après avoir pris connaissance de l&apos;offre périscolaire et de loisirs portée par
          Joy Club · pôle du tiers-lieu Sion Émergence regroupant centre aéré, garderie du
          mercredi et soutien scolaire · je déclare avoir l&apos;intention d&apos;inscrire le ou
          les enfants désignés ci-dessus aux services cochés.
        </Text>
        <Text style={styles.paragraph}>
          Je comprends que la présente lettre constitue une manifestation d&apos;intention et ne
          vaut pas engagement ferme d&apos;inscription. L&apos;inscription définitive fera
          l&apos;objet d&apos;un dossier distinct lors de l&apos;ouverture des services.
        </Text>

        <SignatureBlock
          city={data.city}
          date={data.signedDate}
          signerName={guardianName}
          signatureSvgDataUri={props.signatureDataUri}
        />

        <MetaBox
          submissionId={props.submissionId}
          signedAt={props.signedAt}
          ip={props.ip}
          hash={props.hash}
        />

        <Rgpd scope="pôle Joy Club" />
      </Page>
    </Document>
  );
}
