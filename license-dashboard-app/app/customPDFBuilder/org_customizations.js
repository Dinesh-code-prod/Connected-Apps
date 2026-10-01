/**
 * ORG CUSTOMIZATIONS
 * ============================================================================
 * User-defined customization layer (NOT the product layer). The product engine
 * and all preset sections (module_customizations.js) are never touched.
 * Loaded by both apps alongside module_customizations.js.
 *
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

window.ORG_CUSTOMIZATIONS = {};
