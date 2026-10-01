/**
 * Module overrides for the Universal PDF Builder (Facilio Connected App).
 * pdf_builder_settings.html and pdf_builder.html load this file dynamically
 * before FacilioAppSDK.init().
 * Add one key per module link name. Use `settings` for the template editor and
 * `renderer` for PDF output.
 * Hooks (settings): `defaultSections`, `hiddenFields`, `presetSections`, `attachmentSections`.
 * Hooks (renderer): `taskSection`, `plansActualsSection`, `slaMetricsSection`, `statusLogSection`, `timeDetailsSection`.
 * Optional: `suppressSections` — sectionType values skipped during PDF render.
 */

/**
 * Default hidden fields applied to ALL custom modules (name starts with "custom_").
 * These are Facilio system-default fields that appear in every custom module but
 * are never useful in a PDF output. Module-specific hiddenFields lists are merged
 * on top of these.
 */
window.CUSTOM_MODULE_DEFAULT_HIDDEN_FIELDS = [
  // Raw internal IDs — no human-readable display value
  "approvalFlowId",
  "slaPolicyId",
  // Operational / sync flags — irrelevant in PDF
  "makeRecordOffline",
  // External integration field — generic placeholder, no PDF value
  "externalField",
  // Audit fields — last-modified metadata rarely needed in a PDF report
  "sysModifiedTime",
  "sysModifiedBy",
  // FILE type — does not render in a field grid widget
  "photo",
];

/**
 * Shared column catalog for the "procurement" Line Items style (Purchase Request #PR1 /
 * Purchase Order #PO1 — same rendering, same column-picker mechanism). S.No and Item &
 * Description are alwaysOn (never hidden); the rest are picker-eligible. `width` is a
 * RELATIVE WEIGHT, not a percentage — normalizeCustomTableColumns (renderer) rescales
 * whatever survives the column-picker filter to 100% (INSTRUCTIONS §6).
 */
const PROCUREMENT_LINE_ITEMS_COLUMNS = [
  { key: "seq",       header: "S.No",                 width: 8,  align: "left",  alwaysOn: true },
  { key: "itemDesc",  header: "Item and Description", width: 25, align: "left",  alwaysOn: true },
  { key: "unitPrice", header: "Unit Price",           width: 19, align: "right" },
  { key: "quantity",  header: "Qty",                  width: 8,  align: "right" },
  { key: "taxAmount", header: "Tax",                  width: 13, align: "right" },
  { key: "uom",       header: "UOM",                  width: 8,  align: "left"  },
  { key: "cost",      header: "Amount",               width: 18, align: "right" },
];

/**
 * Column catalog for the "quote" Line Items style, used by the `quote` module entry.
 * S.No and Item & Description are alwaysOn (never hidden); the rest are picker-eligible.
 * `width` is a RELATIVE WEIGHT, not a percentage — normalizeCustomTableColumns (renderer)
 * rescales whatever survives the column-picker filter to 100% (INSTRUCTIONS §6).
 *
 * NOTE (#90): these weights no longer reproduce the table's original hardcoded widths. #52 had
 * matched them deliberately so pre-picker quote templates rendered pixel-identical; #90
 * rebalanced them on purpose because Qty at weight 6 was too narrow for "10.0" and wrapped
 * mid-number. Existing templates therefore render with slightly different column widths than
 * before #90 — an intended visual correction, not a regression.
 *
 * `invoice` uses a SEPARATE, independently-defined catalog (INVOICE_LINE_ITEMS_COLUMNS
 * below) even though the shape is currently identical — the two modules are allowed to
 * diverge later (e.g. hide a quote-only column) without entangling their configs.
 */
const QUOTE_LINE_ITEMS_COLUMNS = [
  // #90 — PDF headers deliberately drop the "w/ markup" qualifier: the marked-up column sits
  // directly beside its base column and Facilio's own native print labels both simply
  // "Unit price" / "Amount", so the distinction is clear from position and the shorter label
  // stops the header overflowing its column. `settingsLabel` keeps the SETTINGS column picker
  // unambiguous — without it an admin would see two identical "Unit price" checkboxes.
  // `key` values are untouched (they are the persisted contract, §2.1); only display text moved.
  //
  // Widths rebalanced in the same change: Qty was 6, too narrow for "10.0" at 11px, which is
  // why it wrapped mid-number. These are RELATIVE weights normalised to 100% by
  // normalizeCustomTableColumns, so the set just has to stay proportionate — the two Amount
  // columns gave up the room (13 was generous for values like "367.50").
  { key: "seq",                 header: "S.No",                 width: 5,  align: "left",   alwaysOn: true },
  { key: "itemDesc",            header: "Item and Description", width: 22, align: "left",   alwaysOn: true },
  { key: "unitPrice",           header: "Unit price",           width: 10, align: "right" },
  { key: "unitPriceWithMarkup", header: "Unit price",           width: 10, align: "right", settingsLabel: "Unit price w/ markup" },
  { key: "quantity",            header: "Qty",                  width: 8,  align: "center" },
  { key: "taxAmount",           header: "Tax",                  width: 9,  align: "right" },
  { key: "markupPercent",       header: "Markup (%)",           width: 9,  align: "right" },
  { key: "uom",                 header: "UOM",                  width: 7,  align: "left"  },
  { key: "cost",                header: "Amount",               width: 10, align: "right" },
  { key: "costWithMarkup",      header: "Amount",               width: 10, align: "right", settingsLabel: "Amount w/ markup" },
];

/**
 * Column catalog for the "quote" Line Items style, used by the `invoice` module entry.
 * Deliberately a SEPARATE const from QUOTE_LINE_ITEMS_COLUMNS (not shared) even though
 * identical in shape today — see the note above.
 */
const INVOICE_LINE_ITEMS_COLUMNS = [
  // #90 — PDF headers deliberately drop the "w/ markup" qualifier: the marked-up column sits
  // directly beside its base column and Facilio's own native print labels both simply
  // "Unit price" / "Amount", so the distinction is clear from position and the shorter label
  // stops the header overflowing its column. `settingsLabel` keeps the SETTINGS column picker
  // unambiguous — without it an admin would see two identical "Unit price" checkboxes.
  // `key` values are untouched (they are the persisted contract, §2.1); only display text moved.
  //
  // Widths rebalanced in the same change: Qty was 6, too narrow for "10.0" at 11px, which is
  // why it wrapped mid-number. These are RELATIVE weights normalised to 100% by
  // normalizeCustomTableColumns, so the set just has to stay proportionate — the two Amount
  // columns gave up the room (13 was generous for values like "367.50").
  { key: "seq",                 header: "S.No",                 width: 5,  align: "left",   alwaysOn: true },
  { key: "itemDesc",            header: "Item and Description", width: 22, align: "left",   alwaysOn: true },
  { key: "unitPrice",           header: "Unit price",           width: 10, align: "right" },
  { key: "unitPriceWithMarkup", header: "Unit price",           width: 10, align: "right", settingsLabel: "Unit price w/ markup" },
  { key: "quantity",            header: "Qty",                  width: 8,  align: "center" },
  { key: "taxAmount",           header: "Tax",                  width: 9,  align: "right" },
  { key: "markupPercent",       header: "Markup (%)",           width: 9,  align: "right" },
  { key: "uom",                 header: "UOM",                  width: 7,  align: "left"  },
  { key: "cost",                header: "Amount",               width: 10, align: "right" },
  { key: "costWithMarkup",      header: "Amount",               width: 10, align: "right", settingsLabel: "Amount w/ markup" },
];

/**
 * Shared ENUM maps for Misc Cost tables (Planned Misc Cost + Actuals Misc Cost, workorder
 * module) — confirmed from `module/meta` for both `workOrderPlannedMiscCost` and
 * `workOrderActualsMiscCost`. Defined ONCE and referenced by both table defs below so the
 * two can never drift (do not duplicate — INSTRUCTIONS §3.3).
 */
const WO_MISC_COST_UOM_ENUM = {
  1: "Each", 2: "Kg", 3: "Hour", 4: "Litres", 5: "Lumpsum", 6: "Number", 7: "Drum",
  8: "Packet", 9: "Roll", 10: "Box", 11: "Metre", 12: "Set", 13: "US Gallon",
  14: "Imperial Gallon", 15: "Square Metre", 16: "Square Feet", 17: "Case", 18: "Flat Fee",
};
const WO_MISC_COST_TYPE_ENUM = {
  1: "Labor", 2: "Tax", 3: "Parts", 4: "Travel", 5: "Shipping",
};

/** Labour "type" ENUM — Actuals Labour table only (workorderLabour.type). Confirmed via module/meta. */
const WO_ACTUALS_LABOUR_TYPE_ENUM = {
  1: "Observation", 2: "Setup", 3: "Travel", 4: "Work",
  5: "Waiting For Material", 6: "Waiting For Access", 7: "Waiting For Other Department Assistance",
};

/**
 * Declarative multi-table config for the "Plans" (sectionType "workorderPlans") and
 * "Actuals" (sectionType "workorderActuals") preset sections — workorder module only.
 * Each section renders up to 5 independent tables (Items/Tools/Services/Labors/Misc), each
 * sourced from its own `unrelated/.../fetchAll/<module>` API call with its own filter field.
 * A table with zero rows is dropped entirely (INSTRUCTIONS §2 additive pattern, mirrors the
 * `!sec.isEmpty` gating already used by `plansActuals`/`workorderCost`/etc.) — see
 * fetchWorkorderPlansActualsSectionIfNeeded / renderer branches in pdf_builder.html.
 *
 * Column `resolve` shapes (interpreted generically by the renderer — no per-column business
 * logic hardcoded into pdf_builder.html):
 *   { type: "plain" }                       — row[key] as-is, "—" fallback if blank
 *   { type: "plainFallback" }                — same as plain (used for description-style text)
 *   { type: "supplement", supplementKey }    — resolves row[key]?.id via
 *                                               meta.supplements.<module>.<supplementKey>[id].name
 *   { type: "enum", map }                    — map[row[key]], "—" if not found
 *   { type: "duration" }                     — converttoduration(row[key]) (seconds → text)
 *   { type: "date" }                         — formatDate(row[key]) (ms epoch → text)
 *   { type: "currency2dp" }                  — formatCurrencyTwoDecimalPlaces(row[key])
 *   { type: "localId" }                      — row.localId, falling back to row.id (the
 *                                               global id) only when localId is null/undefined
 *                                               or 0 — Facilio's convention for "not assigned
 *                                               on this child module" (used for the "ID" columns
 *                                               below: raw global ids aren't the human-facing
 *                                               identifier users expect in a printed report).
 *
 * `width` is a RELATIVE WEIGHT (not a percentage) — rescaled by normalizeCustomTableColumns
 * (renderer) at render time, same rule as any other column-catalog table (INSTRUCTIONS §6).
 */
const WORKORDER_ACTUALS_TABLES = [
  {
    id: "items", label: "Items", module: "workorderItem",
    filterField: "parentId", filterOperatorId: 9,
    columns: [
      { key: "id", header: "ID", align: "left", width: 10, resolve: { type: "localId" } },
      { key: "itemType", header: "Item", align: "left", width: 24, resolve: { type: "supplement", supplementKey: "itemType" } },
      { key: "storeRoom", header: "StoreRoom", align: "left", width: 22, resolve: { type: "supplement", supplementKey: "storeRoom" } },
      { key: "transactionStateLabel", header: "Transaction State", align: "left", width: 22, resolve: { type: "plain" } },
      { key: "quantity", header: "Quantity", align: "right", width: 11, resolve: { type: "currency2dp" } },
      { key: "unitPrice", header: "Unit Price", align: "right", width: 11, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "tools", label: "Tools", module: "workorderTools",
    filterField: "parentId", filterOperatorId: 9,
    columns: [
      { key: "id", header: "ID", align: "left", width: 12, resolve: { type: "localId" } },
      { key: "toolType", header: "Tool", align: "left", width: 24, resolve: { type: "supplement", supplementKey: "toolType" } },
      { key: "storeRoom", header: "StoreRoom", align: "left", width: 22, resolve: { type: "supplement", supplementKey: "storeRoom" } },
      { key: "quantity", header: "Quantity", align: "right", width: 14, resolve: { type: "currency2dp" } },
      { key: "duration", header: "Duration", align: "right", width: 14, resolve: { type: "duration" } },
      { key: "rate", header: "Rate", align: "right", width: 14, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "services", label: "Services", module: "workorderService",
    filterField: "parentId", filterOperatorId: 9,
    columns: [
      { key: "id", header: "ID", align: "left", width: 10, resolve: { type: "localId" } },
      { key: "service", header: "Service", align: "left", width: 20, resolve: { type: "supplement", supplementKey: "service" } },
      { key: "startTime", header: "Start Time", align: "left", width: 18, resolve: { type: "date" } },
      { key: "endTime", header: "End Time", align: "left", width: 18, resolve: { type: "date" } },
      { key: "duration", header: "Duration", align: "right", width: 17, resolve: { type: "duration" } },
      { key: "quantity", header: "Quantity", align: "right", width: 17, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "labors", label: "Labors", module: "workorderLabour",
    filterField: "parentId", filterOperatorId: 9,
    columns: [
      { key: "labour", header: "Labour", align: "left", width: 22, resolve: { type: "supplement", supplementKey: "labour" } },
      { key: "type", header: "Type", align: "left", width: 22, resolve: { type: "enum", map: WO_ACTUALS_LABOUR_TYPE_ENUM } },
      { key: "startTime", header: "Start Time", align: "left", width: 19, resolve: { type: "date" } },
      { key: "endTime", header: "End Time", align: "left", width: 19, resolve: { type: "date" } },
      { key: "duration", header: "Duration", align: "right", width: 18, resolve: { type: "duration" } },
    ],
  },
  {
    id: "misc", label: "Misc", module: "workOrderActualsMiscCost",
    filterField: "workorder", filterOperatorId: 9, forceReload: true,
    columns: [
      { key: "name", header: "Name", align: "left", width: 20, resolve: { type: "plain" } },
      { key: "description", header: "Description", align: "left", width: 24, resolve: { type: "plainFallback" } },
      { key: "unitPrice", header: "Unit Price", align: "right", width: 14, resolve: { type: "currency2dp" } },
      { key: "quantity", header: "Quantity", align: "right", width: 12, resolve: { type: "currency2dp" } },
      { key: "unitOfMeasure", header: "UOM", align: "left", width: 14, resolve: { type: "enum", map: WO_MISC_COST_UOM_ENUM } },
      { key: "miscCostType", header: "Cost Type", align: "left", width: 16, resolve: { type: "enum", map: WO_MISC_COST_TYPE_ENUM } },
    ],
  },
];

const WORKORDER_PLANS_TABLES = [
  {
    id: "items", label: "Items", module: "workOrderPlannedItems",
    filterField: "workOrder", filterOperatorId: 36,
    columns: [
      { key: "id", header: "ID", align: "left", width: 10, resolve: { type: "localId" } },
      { key: "itemType", header: "Item", align: "left", width: 20, resolve: { type: "supplement", supplementKey: "itemType" } },
      { key: "storeRoom", header: "StoreRoom", align: "left", width: 18, resolve: { type: "supplement", supplementKey: "storeRoom" } },
      { key: "quantity", header: "Quantity", align: "right", width: 17, resolve: { type: "currency2dp" } },
      { key: "unitPrice", header: "Unit Price", align: "right", width: 17, resolve: { type: "currency2dp" } },
      { key: "totalCost", header: "Total Cost", align: "right", width: 18, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "tools", label: "Tools", module: "workOrderPlannedTools",
    filterField: "workOrder", filterOperatorId: 36,
    columns: [
      { key: "id", header: "ID", align: "left", width: 16, resolve: { type: "localId" } },
      { key: "toolType", header: "Tool", align: "left", width: 30, resolve: { type: "supplement", supplementKey: "toolType" } },
      { key: "storeRoom", header: "StoreRoom", align: "left", width: 28, resolve: { type: "supplement", supplementKey: "storeRoom" } },
      { key: "quantity", header: "Quantity", align: "right", width: 26, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "services", label: "Services", module: "workOrderPlannedServices",
    filterField: "workOrder", filterOperatorId: 36,
    columns: [
      { key: "service", header: "Service", align: "left", width: 18, resolve: { type: "supplement", supplementKey: "service" } },
      { key: "description", header: "Description", align: "left", width: 22, resolve: { type: "plainFallback" } },
      { key: "quantity", header: "Quantity", align: "right", width: 13, resolve: { type: "currency2dp" } },
      { key: "duration", header: "Duration", align: "right", width: 15, resolve: { type: "duration" } },
      { key: "unitPrice", header: "Unit Price", align: "right", width: 16, resolve: { type: "currency2dp" } },
      { key: "totalCost", header: "Total Cost", align: "right", width: 16, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "labors", label: "Labors", module: "workorderLabourPlan",
    filterField: "parent", filterOperatorId: 9,
    columns: [
      { key: "craft", header: "Craft", align: "left", width: 18, resolve: { type: "supplement", supplementKey: "craft" } },
      { key: "skill", header: "Skill", align: "left", width: 18, resolve: { type: "supplement", supplementKey: "skill" } },
      { key: "quantity", header: "Quantity", align: "right", width: 15, resolve: { type: "currency2dp" } },
      { key: "duration", header: "Duration", align: "right", width: 16, resolve: { type: "duration" } },
      { key: "rateValue", header: "Rate", align: "right", width: 16, resolve: { type: "currency2dp" } },
      { key: "totalPriceValue", header: "Total Price", align: "right", width: 17, resolve: { type: "currency2dp" } },
    ],
  },
  {
    id: "misc", label: "Misc", module: "workOrderPlannedMiscCost",
    filterField: "workorder", filterOperatorId: 9, forceReload: true,
    columns: [
      { key: "name", header: "Name", align: "left", width: 20, resolve: { type: "plain" } },
      { key: "description", header: "Description", align: "left", width: 24, resolve: { type: "plainFallback" } },
      { key: "unitPrice", header: "Unit Price", align: "right", width: 14, resolve: { type: "currency2dp" } },
      { key: "quantity", header: "Quantity", align: "right", width: 12, resolve: { type: "currency2dp" } },
      { key: "unitOfMeasure", header: "UOM", align: "left", width: 14, resolve: { type: "enum", map: WO_MISC_COST_UOM_ENUM } },
      { key: "miscCostType", header: "Cost Type", align: "left", width: 16, resolve: { type: "enum", map: WO_MISC_COST_TYPE_ENUM } },
    ],
  },
];

/**
 * Column catalogs for the two new "receivable" preset sections — Receipts (paginated
 * relatedList fetch of the `receipts` module, related field `receivableId`) and Stocking
 * (read directly from the already-fetched receivable record's poId.lineItems[] — no extra
 * API call, same purchaseorderlineitems row shape as Procurement Line Items).
 *
 * Confirmed via real API responses:
 *   GET /v3/modules/receivable/{id}?id={id}&moduleName=receivable
 *     → poId.lineItems[] rows: name, toolType.name, description, quantity, quantityReceived,
 *       quantityStocked (absent on rows with nothing stocked yet — displayed as "—", not 0).
 *   GET /v3/modules/receivable/{id}/relatedList/receipts/receivableId?...
 *     → receipts[] rows: lineItem.id (resolved via meta.supplements.receipts.lineItem[id]),
 *       quantity, receiptTime (ms epoch), status, statusEnum ("RECEIVED"/"RETURNED"), remarks.
 *
 * `resolve.type` values interpreted by resolveReceivableColumn (renderer):
 *   { type: "lineItemNameDirect" }               — row itself IS the line item; resolves
 *                                                    row.name || itemType?.name || toolType?.name
 *                                                    || service?.name || description || "—"
 *                                                    (same fallback chain as Procurement Line
 *                                                    Items, applied directly to the row).
 *   { type: "lineItemNameSupplement", supplementKey } — row[key] is { id }; the SAME fallback
 *                                                    chain applied to the supplement object at
 *                                                    meta.supplements.<module>.<supplementKey>[id].
 *   { type: "quantity" }                          — formatQuantityOneDecimalPlace(row[key]),
 *                                                    "—" if null/undefined (never coerced to 0 —
 *                                                    explicit user requirement for quantityStocked).
 *   { type: "date" }                              — formatDate(row[key]) (ms epoch → text).
 *   { type: "titleCase" }                         — Title Case of an ENUM string, e.g.
 *                                                    "RETURNED" → "Returned".
 *
 * `width` is a RELATIVE WEIGHT (not a percentage), rescaled to 100% by
 * normalizeCustomTableColumns (renderer) at render time — same rule as every other
 * column-catalog table (INSTRUCTIONS §6). No column picker for either table (fixed catalog,
 * same as WORKORDER_*_TABLES).
 */
const RECEIVABLE_RECEIPTS_COLUMNS = [
  { key: "lineItem",    header: "Line Item", align: "left",  width: 30, resolve: { type: "lineItemNameSupplement", supplementKey: "lineItem" } },
  { key: "quantity",    header: "Quantity",  align: "right", width: 15, resolve: { type: "quantity" } },
  { key: "receiptTime", header: "Time",      align: "left",  width: 22, resolve: { type: "date" } },
  { key: "statusEnum",  header: "Status",    align: "left",  width: 16, resolve: { type: "titleCase" } },
  { key: "remarks",     header: "Remark",    align: "left",  width: 17, resolve: { type: "plain" } },
];

const RECEIVABLE_STOCKING_COLUMNS = [
  { key: "lineItem",         header: "Line Item",         align: "left",  width: 34, resolve: { type: "lineItemNameDirect" } },
  { key: "quantity",         header: "Quantity",          align: "right", width: 22, resolve: { type: "quantity" } },
  { key: "quantityReceived", header: "Received Quantity", align: "right", width: 22, resolve: { type: "quantity" } },
  { key: "quantityStocked",  header: "Stocked Quantity",  align: "right", width: 22, resolve: { type: "quantity" } },
];

window.MODULE_CUSTOMIZATIONS = {
  /**
   * workorder
   *
   * Settings: New templates start with "Work Order Details" and "Comments" pre-loaded.
   *
   * Settings: Internal, AI, approval, flag, and count fields hidden from sidebar.
   *
   * Settings: Preset sections available — Asset/Location, Plans & Actuals, Tasks, Time Details, SLA Metrics, Status Log.
   *
   * Settings: "+ Attachments" shows a picker — WO Before/After Photos (type 1,2)
   *   and Other Attachments (type -1) as separate selectable sections.
   *
   * Renderer: Tasks (sectionType "tasks") — /v2/tasks/parent API, grouped table + photos.
   *
   * Renderer: Plans & Actuals (sectionType "plansActuals") — planned vs actual cost comparison table.
   *
   * Renderer: SLA Metrics (sectionType "slaMetrics") — workorder_sla_metric unrelated fetch.
   *
   * Renderer: Status Log (sectionType "statusLog") — state transition log from API.
   *
   * Renderer: Time Details (sectionType "timeDetails") — 2-col layout from record context.
   *
   * Renderer: woPhotos — Before photos then After photos, filename + timestamp below each.
   *
   * Renderer: otherAttachments — flat grid, filename + timestamp below each.
   */
  workorder: {
    settings: {
      defaultSections: [
        {
          sectionId: "default_wo_details",
          sectionName: "Work Order Details",
          sectionType: "fields",
          fields: [],
        },
        {
          sectionId: "default_wo_comments",
          sectionName: "Comments",
          sectionType: "comments",
          fields: [],
        },
      ],
      hiddenFields: [
        "##totalCost##baseCurrencyValue", "##totalCost##CurrencyValue", "##newCurrency##UI##",
        "stateFlowId", "slaPolicyId", "actionFormId", "formId",
        "exchangeRateId", "moduleId", "orgId", "siteId",
        "noOfAttachments", "noOfNotes",
        "mobileUrl", "url",
        "deleted", "workDurationChangeAllowed", "quotationNeeded",
        "quotationApproved", "userSignatureRequired",
        "approvalState", "approvalStateEnum",
        "currentUserAuthorizedToApprove", "approvalFlowId",
      ],
      presetSections: [
        {
          id: "preset_asset_location",
          label: "Asset / Location Details",
          description: "Renders the resource name and location hierarchy (Space, Floor, Building, Site) — resolved automatically from the work order record.",
          section: {
            sectionName: "Asset / Location Details",
            sectionType: "assetLocation",
            layout: "full",
            fields: [],
            estimatedHeight: 200,
          },
        },
        {
          id: "preset_plans_actuals",
          label: "Plans & Actuals",
          description: "Planned vs actual cost comparison table — fetches planned costs and actual workorderCost records automatically.",
          section: {
            sectionName: "Plans & Actuals",
            sectionType: "plansActuals",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_tasks",
          label: "Tasks",
          description: "Renders the full task checklist with section grouping, status, input values, and before/after photos per task.",
          section: {
            sectionName: "Tasks",
            sectionType: "tasks",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_time_details",
          label: "Time Details",
          description: "Renders scheduled, actual, response due, and due date ranges alongside duration and task completion count.",
          section: {
            sectionName: "Time Details",
            sectionType: "timeDetails",
            layout: "full",
            fields: [],
            estimatedHeight: 260,
          },
        },
        {
          id: "preset_sla_metrics",
          label: "SLA Metrics",
          description: "SLA commitments — shows each SLA policy metric including breach type, due time, completion time, and duration taken.",
          section: {
            sectionName: "SLA Metrics",
            sectionType: "slaMetrics",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_status_log",
          label: "Status Log",
          description: "State transition log — shows each status the work order passed through, with timestamps, duration, and who performed the transition.",
          section: {
            sectionName: "Status Log",
            sectionType: "statusLog",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_requestor_details",
          label: "Requestor Details",
          description: "Renders tenant, client, and requester (inline, paired columns) from the work order record.",
          section: {
            sectionName: "Requestor Details",
            sectionType: "fields",
            layout: "half",
            fieldsLocked: true,
            estimatedHeight: 196,
            fields: [
              { key: "tenant", label: "Tenant", widgetType: "inline" },
              { key: "client", label: "Client", widgetType: "inline" },
              { key: "requester", label: "Requester", widgetType: "inline" },
            ],
          },
        },
        {
          id: "preset_assignee_details",
          label: "Assignee Details",
          description: "Renders assignment group, staff, and vendor (inline, paired columns) from the work order record.",
          section: {
            sectionName: "Assignee Details",
            sectionType: "fields",
            layout: "half",
            fieldsLocked: true,
            estimatedHeight: 196,
            fields: [
              { key: "assignmentGroup", label: "Team", widgetType: "inline" },
              { key: "assignedTo", label: "Staff", widgetType: "inline" },
              { key: "vendor", label: "Vendor", widgetType: "inline" },
            ],
          },
        },
        {
          id: "preset_workorder_plans",
          label: "Plans",
          description: "Up to 5 independent planned-cost tables (Items, Tools, Services, Labors, Misc), each fetched from its own API. Tables with no rows are omitted; the whole section is hidden if all 5 are empty. Independent from the existing Plans & Actuals cost-comparison preset.",
          section: {
            sectionName: "Plans",
            sectionType: "workorderPlans",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_workorder_actuals",
          label: "Actuals",
          description: "Up to 5 independent actual-cost tables (Items, Tools, Services, Labors, Misc), each fetched from its own API. Tables with no rows are omitted; the whole section is hidden if all 5 are empty. Independent from the existing Plans & Actuals cost-comparison preset.",
          section: {
            sectionName: "Actuals",
            sectionType: "workorderActuals",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_workorder_history",
          label: "History",
          description: "The record's full activity timeline, exactly as the History tab shows it — who did what and when, newest first. Covers status changes, SLA activations and breaches, PM-created work orders, and per-field create/update entries. Hidden entirely when the record has no history.",
          section: {
            sectionName: "History",
            sectionType: "workorderHistory",
            layout: "full",
            fields: [],
            // null on purpose: the section paginates on DOM-MEASURED per-entry heights, and
            // #102 made measurement take precedence over this constant anyway. A number here
            // would only ever be the no-DOM fallback, and a wrong one wastes page space.
            estimatedHeight: null,
          },
        },
      ],
      attachmentSections: [
        {
          id: "wo_photos",
          label: "Work Order Before/After Photos",
          sectionType: "woPhotos",
          sectionName: "Work Order Photos",
          typeFilter: [1, 2],
        },
        {
          id: "other_attachments",
          label: "Other Attachments",
          sectionType: "otherAttachments",
          sectionName: "Other Attachments",
          typeFilter: [-1],
        },
      ],
    },
    renderer: {
      notesModule: "ticketnotes",
      attachmentsPrefix: "ticket",
      // #86: type codes owned by workorder's DEDICATED attachment sections — 1 = before photo,
      // 2 = after photo (both render in "WO Before/After Photos"), -1 = "Other Attachments".
      // One API call feeds all three sections, so without this the generic "Attachments" section
      // printed the very same images a second time. Only workorder declares this; every other
      // module omits the key and its Attachments section keeps every image, as before.
      // Set to [1, 2] instead if Other Attachments should ALSO appear in generic Attachments.
      attachmentsExcludeTypes: [1, 2, -1],
      // History / activity timeline (sectionType "workorderHistory").
      //
      // ONE POST call returns the whole timeline — verified live on record 22241810 (org 400000077,
      // Dashboard Repository): HTTP 200, 20.7 KB, 7 activities, which is every row the History tab
      // draws for that record. `{module}` is substituted with the live module link name rather than
      // hardcoding "workorder" twice, so another module can adopt this preset by declaring its own
      // `api` here instead of needing a renderer change.
      //
      // ⚠️ NO pagination parameter is sent, per the standing no-`page`/`perPage` rule (#105), and
      // the response carries NO count and no pagination envelope (verified: its only keys are
      // `responseCode` and `result.activity`). So a server-side cap, if one exists, cannot be
      // detected from the response at all — see `pending_tasks.md` for the open item. The largest
      // history sampled across 11 records was 9 entries, so no cap was observable.
      historySection: {
        api: "/v2/activity/{module}/{module}activity",
        // `changeSet` entries for these fields are DROPPED from a create/update entry. They are
        // audit/system plumbing, not user-visible edits: a create event carried 18 changeSet rows
        // on the sampled record and these seven are pure noise in a printed timeline. Declared
        // here rather than in the renderer so the list is tunable per module without a code change.
        // Removing a name from this list makes that field print again — nothing else to touch.
        excludeChangeSetFields: [
          "sysCreatedTime",
          "sysModifiedTime",
          "createdTime",
          "modifiedTime",
          "approvalState",
          "aiValidationMessageId",
          "serialNumber",
        ],
      },
      taskSection: {
        api: "/v2/tasks/parent/{recordId}",
        attachmentApi: "/attachment?module=taskattachments&recordId={taskId}",
      },
      plansActualsSection: {
        plansApi: "/v3/workOrderPlansCost/cost?workOrderId={recordId}",
      },
      // "Plans" (sectionType "workorderPlans") and "Actuals" (sectionType "workorderActuals")
      // — brand-new, independent multi-table preset sections (NOT related to plansActualsSection
      // above, which stays untouched). Each renders up to 5 tables; see WORKORDER_*_TABLES
      // consts at the top of this file for the full declarative column/fetch definitions.
      workorderPlansActualsSections: {
        workorderActuals: WORKORDER_ACTUALS_TABLES,
        workorderPlans: WORKORDER_PLANS_TABLES,
      },
      slaMetricsSection: {
        module: "workorder_sla_metric",
        entityStatuses: ["ACTIVE", "ON_HOLD", "COMPLETED"],
        // #86: `force` is now opt-in and defaults to false. It was hardcoded `true`, bypassing
        // the server's view cache on every render. Set true again if a live PDF ever shows a
        // stale SLA row on a just-updated record.
        forceReload: false,
      },
      assetLocationSection: {
        // #86: the multiResource probe used to fire on EVERY module with an Asset/Location
        // section, with "workorder" hardcoded in its path — a guaranteed-wasted call anywhere
        // else, silently swallowed by the single-resource fallback. Declaring the probe's parent
        // module here is what opts a module in; omit the key and no probe is issued at all.
        multiResourceProbeModule: "workorder",
      },
      statusLogSection: {
        // #86: `page=1&perPage=50` REMOVED. It capped the status log at 50 transitions with no
        // pagination loop, so anything past that vanished from the PDF without a trace. The
        // whole collection is now resolved in one call; `withCount=true` is kept because the
        // renderer now READS it to detect a server-side limit instead of truncating silently.
        // {module} replaces the previously hardcoded `parentModuleName=workorder` — substituting
        // the live module link name reproduces the old URL exactly here, but stops the preset
        // being workorder-only by construction.
        api: "/v2/statetransition/timelog?parentModuleName={module}&includeParentFilter=true&id={recordId}&withCount=true",
      },
      timeDetailsSection: {
        fields: [
          { key: "scheduledStart",   label: "Scheduled From" },
          { key: "estimatedEnd",     label: "Scheduled To" },
          { key: "actualWorkStart",  label: "Actual From" },
          { key: "actualWorkEnd",    label: "Actual To" },
          { key: "responseDueDate",  label: "Response Due" },
          { key: "dueDate",          label: "Due Date" },
          { key: "noOfClosedTasks",  label: "Completed Tasks" },
          { key: "noOfTasks",        label: "Total Tasks" },
        ],
      },
      // Preset fields / preset field functions REMOVED (session — Org Customization Engine P1).
      // User-defined customizations (fields/photos/signatures/tables) now live in
      // org_customizations.js (window.ORG_CUSTOMIZATIONS). See DECISIONS.md #18.
    },
  },

  /**
   * inventoryrequest
   * - Settings: Line Items preset section (sectionType "lineItems").
   * - Renderer: Notes use inventoryrequestnotes; line items from record field inventoryrequestlineitems.
   */
  inventoryrequest: {
    settings: {
      presetSections: [
        {
          id: "preset_line_items",
          label: "Line Items",
          description: "Renders all requested inventory items — item name, description, store room, requested quantity, and issued quantity.",
          section: {
            sectionName: "Line Items",
            sectionType: "lineItems",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
    },
    renderer: {
      notesModule: "inventoryrequestnotes",
      attachmentsPrefix: "inventoryrequest",
      lineItemsSection: {
        field: "inventoryrequestlineitems",
      },
    },
  },

  /**
   * quote
   *
   * Settings: "Line Items" preset section (sectionType "lineItems") — renders the quote's
   *   embedded line items with up to 10 columns (S.No, Item & Description, Unit price, Unit
   *   price w/ markup, Qty, Tax, Markup %, UOM, Amount, Amount w/ markup) plus an 8-row
   *   summary block (Global Markup, Sub Total, Discount, Misc. Charges, Adjustment Cost,
   *   Shipping Charges, Total Tax, Grand Total). S.No and Item & Description always render;
   *   the rest are user-selectable via the column picker (same UX/mechanism as the
   *   Procurement Line Items preset, #PR1/#PO1 — settings-side picker reads the catalog from
   *   renderer.lineItemsColumns below, filtered to non-alwaysOn entries).
   *
   * Renderer: lineItemsSource "embedded" — line items live in the main record response at
   *   recordData.lineItems[]; no separate API call required.
   *   lineItemsStyle "quote" — activates the (now column-pickable) 10-column-catalog table +
   *   summary footer template. lineItemsColumns (QUOTE_LINE_ITEMS_COLUMNS) is the single
   *   source of truth for column key/header/relative width/align. `width` is a RELATIVE
   *   WEIGHT, not a percentage: normalizeCustomTableColumns (reused, not reimplemented)
   *   rescales whatever survives the column-picker filter to 100% — the standard rule for
   *   any table section with a column picker (INSTRUCTIONS §6). The 10 weights sum to 100,
   *   so existing templates (no selectedColumns set) render identically to before.
   *
   * Discount row: value is shown as a NEGATIVE number (a deduction), per the reference
   *   screenshot — the only summary row formatted this way.
   *
   * Also used by: `invoice` below reuses this exact style name (lineItemsStyle "quote") —
   *   see that entry's doc comment for why.
   */
  quote: {
    settings: {
      presetSections: [
        {
          id: "preset_quote_line_items",
          label: "Line Items",
          description: "Renders the quote line items table with pricing, tax, markup, UOM, and amount columns, plus a summary block (sub-total, discount, taxes, grand total). Choose which pricing columns appear.",
          section: {
            sectionName: "Line Items",
            sectionType: "lineItems",
            layout: "full",
            fields: [],
            estimatedHeight: null,
            selectedColumns: null,
          },
        },
        {
          id: "preset_quote_bill_to_address",
          label: "Billing Address",
          description: "Renders the quote's billing address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Bill To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no billing address is set.",
          section: {
            sectionName: "Billing Address",
            sectionType: "billToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_quote_ship_to_address",
          label: "Shipping Address",
          description: "Renders the quote's shipping address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Ship To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no shipping address is set.",
          section: {
            sectionName: "Shipping Address",
            sectionType: "shipToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
    },
    renderer: {
      lineItemsSource: "embedded",
      lineItemsStyle: "quote",
      lineItemsColumns: QUOTE_LINE_ITEMS_COLUMNS,
    },
  },

  /**
   * invoice
   *
   * Settings: identical "Line Items" preset to quote above — same columns, same picker,
   *   same 8-row summary block shape.
   *
   * Renderer: lineItemsStyle "quote" (REUSED, not a new style value) — invoice.lineItems[]
   *   is embedded directly on the invoice record with the exact same per-row shape as
   *   quote.lineItems[] (itemType/toolType/service, tax, quantity, unitPrice, cost,
   *   taxAmount, description, unitOfMeasure/unitOfMeasureEnum, markup, unitPriceWithMarkup,
   *   costWithMarkup, type, name, typeEnum), and the same top-level summary fields
   *   (subTotal, discountAmount, miscellaneousCharges, adjustmentsCost, shippingCharges,
   *   totalTaxAmount, totalCost, totalMarkup) confirmed present on the invoice record the
   *   same way they are on quote. Since the rendering is byte-identical, invoice reuses the
   *   "quote" lineItemsStyle rather than inventing a new one — the existing
   *   lineItemsSource:"embedded" branch in buildSections needs zero data-mapping changes,
   *   it is simply now also matched when the module is `invoice`. Only the column catalog
   *   differs (INVOICE_LINE_ITEMS_COLUMNS — a separate const from QUOTE_LINE_ITEMS_COLUMNS
   *   by design, see that const's doc comment), resolved generically via
   *   `window.MODULE_CUSTOMIZATIONS[contextModuleLinkName.value]?.renderer`.
   */
  invoice: {
    settings: {
      presetSections: [
        {
          id: "preset_invoice_line_items",
          label: "Line Items",
          description: "Renders the invoice line items table with pricing, tax, markup, UOM, and amount columns, plus a summary block (sub-total, discount, taxes, grand total). Choose which pricing columns appear.",
          section: {
            sectionName: "Line Items",
            sectionType: "lineItems",
            layout: "full",
            fields: [],
            estimatedHeight: null,
            selectedColumns: null,
          },
        },
        {
          id: "preset_invoice_bill_to_address",
          label: "Billing Address",
          description: "Renders the invoice's billing address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Bill To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no billing address is set.",
          section: {
            sectionName: "Billing Address",
            sectionType: "billToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_invoice_ship_to_address",
          label: "Shipping Address",
          description: "Renders the invoice's shipping address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Ship To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no shipping address is set.",
          section: {
            sectionName: "Shipping Address",
            sectionType: "shipToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
    },
    renderer: {
      lineItemsSource: "embedded",
      lineItemsStyle: "quote",
      lineItemsColumns: INVOICE_LINE_ITEMS_COLUMNS,
    },
  },

  /**
   * purchaserequest
   *
   * Settings: "Line Items" preset section (sectionType "lineItems") — S.No and Item &
   *   Description always render; Unit Price, Qty, Tax, UOM, and Amount are user-selectable
   *   via the column picker ("Columns to include" — same UX as a Custom Table, #25).
   *   settings-side picker reads the catalog from renderer.lineItemsColumns below (filtered
   *   to non-alwaysOn entries). Plus a 2-or-3-row summary block (Sub Total, Discount [hidden
   *   when there's no discount], Grand Total).
   *
   * Renderer: lineItemsStyle "procurement" (shared with purchaseorder below) — line items are
   *   fetched via the dedicated paginated relatedList endpoint
   *   (renderer.lineItemsRelatedList: module `purchaserequestlineitems`, related field
   *   `purchaseRequest`) rather than embedded on the record. Row shape has NO inline item/
   *   tool/service name — only `description` — so the name is resolved from
   *   `meta.supplements.{itemType|toolType|service}[id].name` (same resolution pattern the
   *   inventoryrequest lineItems variant already uses). Summary-block totals (subTotal,
   *   discountAmount, totalCost) still come from the module's own full-record fetch, which
   *   happens generically for any module — no extra call needed for those.
   *   lineItemsColumns (PROCUREMENT_LINE_ITEMS_COLUMNS) is the single source of truth for
   *   column key/header/relative width/align — both apps read it (settings for the picker
   *   labels, renderer for the table itself), so the two can never drift. `width` is a
   *   RELATIVE WEIGHT, not a percentage: normalizeCustomTableColumns (reused, not
   *   reimplemented) rescales whatever survives the column-picker filter to 100% — the
   *   standard rule for any table section with a column picker (INSTRUCTIONS §6).
   */
  purchaserequest: {
    settings: {
      presetSections: [
        {
          id: "preset_pr_line_items",
          label: "Line Items",
          description: "Renders the purchase request's line items — item & description, unit price, quantity, tax, UOM, and amount — plus a summary block (sub-total, discount, grand total). Choose which pricing columns appear.",
          section: {
            sectionName: "Line Items",
            sectionType: "lineItems",
            layout: "full",
            fields: [],
            estimatedHeight: null,
            selectedColumns: null,
          },
        },
        {
          id: "preset_pr_bill_to_address",
          label: "Billing Address",
          description: "Renders the purchase request's billing address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Bill To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no billing address is set.",
          section: {
            sectionName: "Billing Address",
            sectionType: "billToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_pr_ship_to_address",
          label: "Shipping Address",
          description: "Renders the purchase request's shipping address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Ship To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no shipping address is set.",
          section: {
            sectionName: "Shipping Address",
            sectionType: "shipToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
    },
    renderer: {
      lineItemsStyle: "procurement",
      lineItemsRelatedList: { lineItemsModule: "purchaserequestlineitems", relatedFieldName: "purchaseRequest" },
      lineItemsColumns: PROCUREMENT_LINE_ITEMS_COLUMNS,
    },
  },

  /**
   * purchaseorder
   *
   * Settings: identical "Line Items" preset to purchaserequest above — same columns, same
   *   picker, same summary block shape.
   *
   * Renderer: lineItemsStyle "procurement" (shared — see purchaserequest doc above for the
   *   full explanation). renderer.lineItemsRelatedList points at module
   *   `purchaseorderlineitems`, related field `purchaseOrder`. Confirmed via a real
   *   `GET .../purchaseorder/{id}/relatedList/purchaseorderlineitems/purchaseOrder` response —
   *   same row shape as purchaserequestlineitems (name resolved via supplements, not inline).
   */
  purchaseorder: {
    settings: {
      presetSections: [
        {
          id: "preset_po_line_items",
          label: "Line Items",
          description: "Renders the purchase order's line items — item & description, unit price, quantity, tax, UOM, and amount — plus a summary block (sub-total, discount, grand total). Choose which pricing columns appear.",
          section: {
            sectionName: "Line Items",
            sectionType: "lineItems",
            layout: "full",
            fields: [],
            estimatedHeight: null,
            selectedColumns: null,
          },
        },
        {
          id: "preset_po_bill_to_address",
          label: "Billing Address",
          description: "Renders the purchase order's billing address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Bill To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no billing address is set.",
          section: {
            sectionName: "Billing Address",
            sectionType: "billToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_po_ship_to_address",
          label: "Shipping Address",
          description: "Renders the purchase order's shipping address — Street, City/District, State/Province/County, Zip Code, Country — read from the record's Ship To location. Adds no API call. Blank lines are skipped; the section is hidden entirely when no shipping address is set.",
          section: {
            sectionName: "Shipping Address",
            sectionType: "shipToAddress",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
    },
    renderer: {
      lineItemsStyle: "procurement",
      lineItemsRelatedList: { lineItemsModule: "purchaseorderlineitems", relatedFieldName: "purchaseOrder" },
      lineItemsColumns: PROCUREMENT_LINE_ITEMS_COLUMNS,
    },
  },

  /**
   * receivable
   *
   * Settings: two independent single-table preset sections — Receipts (sectionType
   *   "receivableReceipts") and Stocking (sectionType "receivableStocking"). Both use the
   *   generic customTable-style column/row rendering with real multi-row pagination
   *   (splitTableSectionIntoSlices) — NOT the atomic per-table hack used by Plans & Actuals.
   *
   * Renderer: Receipts fetched via paginated relatedList (module `receipts`, related field
   *   `receivableId`) — see RECEIVABLE_RECEIPTS_COLUMNS doc-comment above for the confirmed
   *   API shape. Stocking reads directly from the already-fetched receivable record's
   *   poId.lineItems[] — no extra API call, see RECEIVABLE_STOCKING_COLUMNS doc-comment.
   */
  receivable: {
    settings: {
      presetSections: [
        {
          id: "preset_receivable_receipts",
          label: "Receipts",
          description: "Renders every receipt logged against this receivable — line item, quantity, time, status, and remark.",
          section: {
            sectionName: "Receipts",
            sectionType: "receivableReceipts",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_receivable_stocking",
          label: "Stocking",
          description: "Renders each line item's ordered, received, and stocked quantities.",
          section: {
            sectionName: "Stocking",
            sectionType: "receivableStocking",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
    },
    renderer: {
      receivableReceiptsSection: {
        module: "receipts",
        relatedFieldName: "receivableId",
        columns: RECEIVABLE_RECEIPTS_COLUMNS,
      },
      receivableStockingSection: {
        columns: RECEIVABLE_STOCKING_COLUMNS,
      },
    },
  },

  /**
   * inspectionResponse
   *
   * Settings: Default template starts EMPTY (no defaultSections). Inspection "details"
   *   are built by the user as a normal fields section. Preset sections: Summary, Checklist.
   *   Findings is a multi-pick preset (like the Attachments picker) exposing 4 finding-scoped
   *   sub-sections via `findingSections`.
   *
   * Renderer: Checklist (sectionType "inspectionChecklist") — pages fetched per parent.pages[]
   *   via the unrelated qandaPage API; questions rendered by answer type. MATRIX is DEFERRED
   *   (rendered as an unsupported placeholder for now — see HANDOFF Session 6).
   *   Summary (sectionType "inspectionScore") — 4 tiles from the record (hidden when no data).
   *   Findings (sectionTypes inspectionFinding*) — per finding, from the finding module fetch.
   */
  inspectionResponse: {
    settings: {
      // Internal / raw / audit fields that are never useful in an inspection PDF.
      hiddenFields: [
        "approvalFlowId", "slaPolicyId", "stateFlowId", "actionFormId", "formId",
        "exchangeRate", "moduleId", "orgId", "localId",
        "sysModifiedTime", "sysModifiedBy",
        "countryId", "county", "stateId", "territory", "orgUnitId",
        "isRetakeAllowed", "retakeExpiry", "retakeExpiryDuration", "expiryDate",
        "totalNoOfPages", "totalNumberOfQuestions", "totalNumberOfAnswers",
        "subContractor",
      ],
      presetSections: [
        {
          id: "preset_insp_summary",
          label: "Summary",
          description: "Inspection summary tiles — Checklist score & answered count, Findings completed, actual time range, and location. Tiles with no data are hidden automatically.",
          section: {
            sectionName: "Summary",
            sectionType: "inspectionScore",
            layout: "full",
            fields: [],
            estimatedHeight: 140,
          },
        },
        {
          id: "preset_insp_checklist",
          label: "Checklist",
          description: "Renders the full Q&A checklist grouped by page (and section if present) — each question with its answer, score, attachments, and any inline findings.",
          section: {
            sectionName: "Checklist",
            sectionType: "inspectionChecklist",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
        {
          id: "preset_insp_findings",
          label: "Findings",
          description: "Every finding raised on this inspection, one strip per finding — photos, name, description, priority, status, and assignee. All of it resolves from the single findings fetch, so this section adds no per-finding API calls.",
          section: {
            sectionName: "Findings",
            sectionType: "inspectionFindingsList",
            layout: "full",
            fields: [],
            estimatedHeight: null,
          },
        },
      ],
      // Findings multi-pick picker — RETIRED (#109). The four finding-scoped sub-sections
      // (inspectionFindingDetails / Image / Comments / Attachments) were replaced by the single
      // `inspectionFindingsList` preset above, which renders one strip per finding and costs one
      // API call instead of 1 + 2N.
      //
      // Emptying this array is what retires them: the settings app's "+ Findings" button is
      // gated on `v-if="moduleFindingSections.length"`, so an empty list hides the button and no
      // NEW template can be given one of those four types.
      //
      // Their decoder branch (pdf_builder_settings.html parseStoredConfigToSections) and their
      // whole renderer path (buildSections / renderSectionForMeasurement / readSectionHeights /
      // packer / Vue render) are deliberately LEFT IN PLACE — any template already saved with
      // them must still parse and still print (§2.1/§2.5). Deleting either side would trip the
      // two silent failure modes §5 names: the settings parser rewrites an undecoded type to
      // `fields` and destroys it on save (#70), and the packer has no `default` branch, so the
      // section would vanish from the PDF with no error. The picker code itself (onFindingsClick
      // / confirmFindingPicker) also stays — dormant, not dead, and functional again the moment
      // this array is repopulated.
      findingSections: [],
    },
    renderer: {
      // Inspection-level comments (standard comments section) use cmdnotes.
      notesModule: "cmdnotes",
      checklistSection: {
        pageFetchApi: "/v3/unrelated/inspectionResponse/fetch/qandaPage/{pageId}?response={recordId}&responseModuleName=inspectionResponse",
        // MATRIX renders as a sub-table (#62). MULTI_QUESTION renders too, as a parent
        // question with its child rows (#55) — so this list no longer describes reality.
        //
        // #101 — the key is also DEAD: nothing in either app reads `unsupportedTypes`
        // (grep-verified — this line is its only occurrence in the repo). Kept rather than
        // deleted per §2.5, with the comment corrected so it cannot mislead a future reader
        // into thinking MULTI_QUESTION is unhandled. Removing it is safe whenever §2.5 allows.
        unsupportedTypes: ["MULTI_QUESTION"],
      },
      findingsSection: {
        module: "finding",
        filterField: "inspectionResponse",
        filterOperatorId: 36,
        commentsApi: "/note/finding/get/{findingId}?module=findingComment&onlyFetchParentNotes=true",
        attachmentApi: "/attachment/findingDocument/finding/list/{findingId}",
        // Org-specific: field keys and enum values depend on the finding module's schema.
        // Add entries here per org — each entry: { key, label, lookup?, enumMap?, boolMap? }
        // lookup: true — resolved via meta.supplements.finding.<key>[id]
        // enumMap: { int: "Label" } — for ENUM fields
        // boolMap: { true: "Yes", false: "No" } — for BOOLEAN fields
        detailFields: [],
      },
      // Summary tiles read straight from the record; documented here for reference.
      scoreSection: {
        scorePercent:        "scorePercent",
        totalAnswered:       "totalAnswered",
        totalQuestion:       "totalQuestion",
        totalFindings:       "totalFindings",
        totalFindingsClosed: "totalFindingsClosed",
        actualStart:         "actualWorkStart",
        actualEnd:           "actualWorkEnd",
        building:            "buildingSpace",
        site:                "site",
      },
    },
  },

  /**
   * custom — fallback for all custom_* modules
   */
  custom: {
    renderer: {},
  },
};

/*
other_module: {
  settings: {
    defaultSections: [],
  },
  renderer: {
    suppressSections: [],
  },
},
*/
