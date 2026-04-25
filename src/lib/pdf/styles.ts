import { StyleSheet, Font } from "@react-pdf/renderer";

// On utilise les fontes par défaut (Helvetica) — pas de téléchargement réseau requis.
// Pour passer à une fonte personnalisée plus tard : Font.register({ family: 'Inter', src: '...' })

export const palette = {
  ink: "#1A1A1A",
  muted: "#5C5C5C",
  rule: "#1A1A1A",
  accent: "#0F4C5C",
  pale: "#F4F1EC",
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: palette.ink,
    lineHeight: 1.4,
  },
  brand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    letterSpacing: 1.2,
    color: palette.accent,
    marginBottom: 1,
  },
  brandSub: {
    fontSize: 8.5,
    color: palette.muted,
    marginBottom: 1,
  },
  brandFounders: {
    fontSize: 8.5,
    color: palette.muted,
    marginBottom: 10,
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: palette.rule,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9.5,
    color: palette.muted,
    marginBottom: 12,
  },
  section: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 8,
    marginBottom: 4,
    color: palette.accent,
  },
  field: {
    flexDirection: "row",
    marginBottom: 2,
  },
  fieldLabel: {
    width: 120,
    color: palette.muted,
  },
  fieldValue: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify",
  },
  table: {
    marginTop: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  trLast: {
    flexDirection: "row",
  },
  th: {
    flex: 1,
    padding: 4,
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    backgroundColor: palette.pale,
    borderRightWidth: 1,
    borderRightColor: "#CCC",
  },
  td: {
    flex: 1,
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#CCC",
  },
  tdCenter: {
    flex: 1,
    padding: 4,
    fontSize: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#CCC",
  },
  tdCheck: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  tdLast: {
    flex: 1,
    padding: 4,
    fontSize: 9,
  },
  signRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 14,
  },
  signCol: {
    flex: 1,
  },
  signLabel: {
    fontSize: 8.5,
    color: palette.muted,
    marginBottom: 2,
  },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: palette.ink,
    paddingBottom: 2,
    minHeight: 44,
    justifyContent: "flex-end",
  },
  signImage: {
    maxHeight: 44,
    objectFit: "contain",
  },
  rgpd: {
    marginTop: 10,
    fontSize: 7.5,
    color: palette.muted,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#CCC",
  },
  metaBox: {
    marginTop: 5,
    padding: 4,
    backgroundColor: palette.pale,
    fontSize: 7,
    color: palette.muted,
  },
});
