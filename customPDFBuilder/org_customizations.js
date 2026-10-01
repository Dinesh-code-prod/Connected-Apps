/**
 * ORG CUSTOMIZATIONS — MODON ONLY
 * ============================================================================
 * User-defined customization layer (NOT the product layer). The product engine
 * and all preset sections (module_customizations.js) are never touched.
 * Loaded by both apps alongside module_customizations.js.
 *
 * This file is currently scoped to the MODON org only. It wires one backend
 * function (see org-configs/modon-backend-functions.md):
 *   workorder → fetchWorkorderAdditionalFields (nameSpace "pdfPrintFetchFunctions")
 *     — returns 4 custom-ENUM display labels under result.fields.
 *
 * BACKEND ENVELOPE (the function returns this at result.workflow.returnValue):
 *   { fields:{…}, photos:{…}, signatures:{…}, tables:{ key:{columns,rows} } }
 *
 * valuePath grammar (resolved against { result }):
 *   "result.fields.x" | "result.photos.x" | "result.signatures.x" | "result.tables.x"
 *
 * NOTE: this file is PER-ORG (#23/#25). Swapping orgs = swapping this file too.
 * Reference copies live in org-configs/<org>.org_customizations.js.
 */

window.ORG_CUSTOMIZATIONS = {
  workorder: {
    functions: [
      { id: "woAddl", nameSpace: "pdfPrintFetchFunctions", functionName: "fetchWorkorderAdditionalFields" },
    ],
    customFields: [
      { id: "modon_wo_resolution_sla", label: "Resolution SLA Status", functionRef: "woAddl", valuePath: "result.fields.resolutionSla",   widgetType: "inline" },
      { id: "modon_wo_response_sla",   label: "Response SLA Status",   functionRef: "woAddl", valuePath: "result.fields.responseSla",     widgetType: "inline" },
      { id: "modon_wo_site_outcome",   label: "Site Outcome",          functionRef: "woAddl", valuePath: "result.fields.siteOutcome",     widgetType: "inline" },
      { id: "modon_wo_threshold",      label: "Threshold Status",      functionRef: "woAddl", valuePath: "result.fields.thresholdStatus", widgetType: "inline" },
    ],
    customPhotos: [],
    customSignatures: [],
    customTables: [],
  },
};
