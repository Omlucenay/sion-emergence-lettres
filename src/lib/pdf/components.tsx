import { View, Text, Image, Svg, Path } from "@react-pdf/renderer";
import { styles, palette } from "./styles";

export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View
      style={{
        width: 11,
        height: 11,
        borderWidth: 1,
        borderColor: palette.ink,
        backgroundColor: checked ? palette.accent : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked ? (
        <Svg width={9} height={9} viewBox="0 0 16 16">
          <Path
            d="M2 8 L6.5 12.5 L14 4"
            stroke="#FFFFFF"
            strokeWidth={2.4}
            fill="none"
          />
        </Svg>
      ) : null}
    </View>
  );
}

export function Header() {
  return (
    <View>
      <Text style={styles.brand}>SION ÉMERGENCE</Text>
      <Text style={styles.brandSub}>
        Tiers-lieu éducatif et communautaire · Le Lamentin, Martinique
      </Text>
      <Text style={styles.brandFounders}>
        Représenté par Olivier-Marie LUCENAY et Karla LUCENAY, cofondateurs
      </Text>
      <View style={styles.rule} />
    </View>
  );
}

export function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value ?? ""}</Text>
    </View>
  );
}

export function SignatureBlock(props: {
  city: string;
  date: string;
  signerName: string;
  signatureSvgDataUri?: string; // PNG data URL converted from SVG signature, or undefined
}) {
  return (
    <View style={styles.signRow}>
      <View style={styles.signCol}>
        <Text style={styles.signLabel}>Fait à</Text>
        <Text>{props.city}</Text>
        <Text style={[styles.signLabel, { marginTop: 8 }]}>Le</Text>
        <Text>{props.date}</Text>
      </View>
      <View style={styles.signCol}>
        <Text style={styles.signLabel}>Signature</Text>
        <View style={styles.signLine}>
          {props.signatureSvgDataUri ? (
            <Image src={props.signatureSvgDataUri} style={styles.signImage} />
          ) : null}
        </View>
        <Text style={{ fontSize: 8, color: palette.muted, marginTop: 4 }}>
          {props.signerName}
        </Text>
      </View>
    </View>
  );
}

export function MetaBox(props: {
  submissionId: string;
  signedAt?: string;
  ip?: string;
  hash?: string;
}) {
  return (
    <View style={styles.metaBox}>
      <Text>
        Signature électronique · Réf : {props.submissionId}
        {props.signedAt ? ` · Signée le ${props.signedAt}` : ""}
        {props.ip ? ` · IP ${props.ip}` : ""}
      </Text>
      {props.hash ? <Text>Empreinte SHA-256 : {props.hash}</Text> : null}
    </View>
  );
}

export function Rgpd({ scope }: { scope: string }) {
  return (
    <Text style={styles.rgpd}>
      RGPD · Données traitées par Sion Émergence aux seules fins de l&apos;instruction
      du {scope}. Aucune cession à des tiers. Droits d&apos;accès, rectification,
      effacement, opposition : contact@sion-emergence.fr.
    </Text>
  );
}
