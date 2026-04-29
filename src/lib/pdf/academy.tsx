import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Header, Field, SignatureBlock, MetaBox, Rgpd } from "./components";
import { fullName, formatAddress, type AcademyData } from "../schemas";

export function AcademyPdf(props: {
  data: AcademyData;
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
      title={`Sion Academy · Lettre d'intention · ${guardianName}`}
      author="Sion Émergence"
    >
      <Page size="A4" style={styles.page}>
        <Header />

        <Text style={styles.title}>Lettre d&apos;intention d&apos;inscription · Sion Academy</Text>
        <Text style={styles.subtitle}>
          École primaire hors contrat, non confessionnelle. Rentrée inaugurale : septembre 2026.
        </Text>

        <Text style={styles.section}>Responsable(s) légal(aux)</Text>
        <Field label="Nom et prénom" value={guardianName} />
        <Field label="Adresse postale" value={address} />
        <Field label="Téléphone" value={data.phone} />
        <Field label="Courriel" value={data.email} />

        <Text style={styles.section}>Enfant(s) concerné(s)</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={styles.th}>Nom et prénom</Text>
            <Text style={styles.th}>Date de naissance</Text>
            <Text style={[styles.th, { borderRightWidth: 0 }]}>Niveau visé à la rentrée</Text>
          </View>
          {data.children.map((c, i) => {
            const isLast = i === data.children.length - 1;
            return (
              <View key={i} style={isLast ? styles.trLast : styles.tr}>
                <Text style={styles.td}>{fullName(c.firstName, c.lastName)}</Text>
                <Text style={styles.td}>{c.birthDate}</Text>
                <Text style={[styles.td, { borderRightWidth: 0 }]}>{c.level}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.section}>Déclaration d&apos;intention</Text>
        <Text style={styles.paragraph}>
          Après avoir pris connaissance du projet Sion Academy · école primaire privée hors
          contrat et non confessionnelle, implantée au Lamentin, dont la rentrée inaugurale est
          prévue en septembre 2026 · je déclare avoir l&apos;intention d&apos;inscrire le ou les
          enfants désignés ci-dessus.
        </Text>
        <Text style={styles.paragraph}>
          Je comprends que la présente lettre constitue une manifestation d&apos;intention et ne
          vaut pas engagement ferme d&apos;inscription. L&apos;inscription définitive fera
          l&apos;objet d&apos;un dossier et d&apos;un contrat de scolarité distincts.
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

        <Rgpd scope="projet d'école" />
      </Page>
    </Document>
  );
}
