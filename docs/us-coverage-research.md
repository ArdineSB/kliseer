Correction after the API counts in this session: Seattle **electrical** `c4tj-daue` is the Seattle lead feed (non-residential since 2025-10-01: 2,490 permits, 2,188 with `contractorcompanyname`). Building `76t5-zqzr` non-residential in that window is 1,475 permits and only 102 with a contractor name. Dallas commercial electrical dated `%/26` is 5,517 permits and 43 with `contractor`; the 5,877 figure below is not current-year fill. Austin resource also answers at `https://data.austintexas.gov/resource/3syk-w9eu.json`; `link.url` was confirmed.

# US coverage research — permits and public construction

Date: 2026-11-04. Primary catalogs and official endpoints only. Not a nationwide feed. Each row below is one jurisdiction.

Status words: `live-tested` = this session called the endpoint and got records (field names recorded, no contact dumps). `validated` = official catalog or dataset page returned the dataset. `to-test` = mentioned only, not opened. `failed` = fetch did not return a dataset.

Already known, not re-tested here: NYC DOB NOW `https://data.cityofnewyork.us/resource/rbx6-tga4.json`; USAspending `spending_by_award` (federal awards only); SAM.gov opportunities (key, not called); NYC DEP bids page.

Census Building Permits Survey is aggregate private new-housing statistics. Not a per-company lead source. Not opened.

Paid aggregators (Shovels, BuildZoom, Dodge, ConstructConnect): not official, not opened.

`data.gov` CKAN `https://catalog.data.gov/api/3/action/package_search?q=building+permits` returned HTTP 404. Do not treat a catalog listing as coverage.

`sources.md` assumes one SODA adapter and the domains below. Several of those domains are wrong or dead. Confirmed hosts are in each card.

---

## Fetched and confirmed

### Austin — Issued Construction Permits — `live-tested` — integrate first

| | |
|---|---|
| Official page | `https://datahub.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu` (HTML title fetched). Permalink in Socrata catalog: `https://datahub.austintexas.gov/d/3syk-w9eu` |
| Endpoint actually called | `https://data.austintexas.gov/resource/3syk-w9eu.json` |
| Dataset id | `3syk-w9eu` |
| Access | SODA, no key. Catalog attribution: City of Austin, `data.austintexas.gov`. Catalog `data_updated_at` 2026-11-03. Owner text: BLDS-compliant; informational disclaimer. |
| Geography | City of Austin only. Not Travis County, not Texas. |
| Company name | Yes. `contractor_company_name`. Also `contractor_trade`, `applicant_org`. Do not use `contractor_full_name` / phone / address. |
| Date | `issue_date` ISO. Drop nulls. |
| Record id | `permit_number` |
| Source URL | Use the record `link.url`. Observed pattern `https://abc.austintexas.gov/web/permit/public-search-other?t_detail=1&t_selected_folderrsn={n}`. `{n}` is not the permit number. Do not invent it. |
| Commercial vs residential | `permit_class_mapped` is `Commercial` or `Residential` (owner: class starting with `R` = residential). `permit_type_desc` includes `Electrical Permit`. `electrical_valuation` exists. |
| License | Terms page fetched: `https://data.austintexas.gov/stories/s/ranj-cccq`. City employee data on the portal is public domain unless metadata says otherwise. No warranty. Do not re-identify people. Attribution requested. |
| Check | SODA `$where=contractor_company_name IS NOT NULL AND permit_class_mapped='Commercial' AND upper(permittype) like '%EP%'`, `$order=issue_date DESC`, `$limit=2`. Returned 2026-11-02 rows: `permit_type_desc=Electrical Permit`, `contractor_trade=Electrical Contractor`, `status_current=Active`, company names `Tovar Electrical Services` and `Bosco Electric`. |

### Seattle — Building Permits — `live-tested`

| | |
|---|---|
| Official page | `https://data.seattle.gov/Built-Environment/Building-Permits/76t5-zqzr` (HTML title fetched). Catalog link: `https://cos-data.seattle.gov/Built-Environment/Building-Permits/76t5-zqzr` |
| Endpoint actually called | `https://cos-data.seattle.gov/resource/76t5-zqzr.json` |
| Dataset id | `76t5-zqzr` |
| Access | SODA, no key. Discovery domain is `cos-data.seattle.gov`, not `data.seattle.gov`. Publisher metadata: Seattle Department of Construction & Inspections. Refresh: Daily. Catalog `data_updated_at` 2026-11-04. |
| Geography | City of Seattle only. |
| Company name | Yes. `contractorcompanyname` (“The contractor(s) associated with this permit.”). No separate trade column. Values are dirty: real firms and placeholders (`BLANKET: MARKET PLACE OFFICE`). Filter blanks and `BLANKET:`. |
| Date | `issueddate` ISO. Null means not issued. Drop nulls. |
| Record id | `permitnum` |
| Source URL | `link.url`. Observed `https://services.seattle.gov/portal/customize/LinkToRecord.aspx?altId={permitnum}` |
| Commercial vs residential | `permitclass` includes `Commercial` and `Multifamily`. `permitclassmapped` is `Non-Residential` or `Residential`. |
| License | Catalog metadata `license`: Public Domain. |
| Check | SODA returned issued rows with `contractorcompanyname` (`Lifetime Flat Roofs`, `BNBuilders`, issued 2026-11-02 and 2026-10-24) and commercial rows (`Venture General Contracting LLC`, issued 2026-10-23, `permitclass=Commercial`, `statuscurrent=Issued`). |

### San Francisco — permits plus contacts — `live-tested` (two datasets)

Portal host is `data.sf.gov`. `data.sfgov.org` redirects there. Federated `domains=data.sfgov.org` returned 0. `search_context=data.sfgov.org` returned the datasets.

**Building Permits** `i98e-djp9`

| | |
|---|---|
| Page | `https://data.sf.gov/Housing-and-Buildings/Building-Permits/i98e-djp9` |
| Endpoint called | `https://data.sfgov.org/resource/i98e-djp9.json?$limit=1` (served from `data.sf.gov`) |
| Company name | No. Sample keys: `permit_number`, `permit_type`, `permit_type_definition`, `description`, `status`, `issued_date`, `filed_date`, `record_id`, address, occupancy. No contractor, firm, or applicant field in the returned record. |
| Date | `issued_date` ISO. |
| Record id | `permit_number` or `record_id` |
| Commercial vs residential | `existing_occupancy` / `proposed_occupancy` (sample `R-2,M`). No clean commercial flag in the sample. |
| Weak alone | No business name. Do not ingest as a lead source by itself. |

**Building Permits Contacts** `3pee-9qhc`

| | |
|---|---|
| Page | `https://data.sf.gov/Housing-and-Buildings/Building-Permits-Contacts/3pee-9qhc` |
| Endpoint called | `https://data.sf.gov/resource/3pee-9qhc.json` |
| Access | SODA, no key. Publishing department: Building Inspection. Frequency: Weekly. Catalog `data_updated_at` 2026-11-03. Owner: join to Building Permits. DBI lookup site named in the description: `www.sfdbi.org/dbipts`. No per-record URL template was in the API response. |
| Geography | San Francisco. |
| Company name | Yes. `firm_name`. Also `role`, `first_name`, `last_name`. Use `firm_name` only. |
| Date | `from_date` exists but is often omitted/null on newest rows. 587,101 rows have `role='contractor' AND firm_name IS NOT NULL AND from_date IS NOT NULL`. For a usable `signalDate`, join `permit_number` to `i98e-djp9.issued_date` and drop nulls. |
| Record id | `id` (contact row). Permit id: `permit_number`. |
| License | Catalog: Open Data Commons Public Domain Dedication and License. |
| Check | `$where=firm_name IS NOT NULL AND upper(role) like '%CONTRACT%'`, `$limit=2`. Returned `role=contractor`, firms `Flores General Building` and `Dome Construction Corp`. Those two rows had no `from_date`. |

### Chicago — Building Permits — `live-tested`

| | |
|---|---|
| Page | `https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu` |
| Views metadata | `https://data.cityofchicago.org/api/views/ydr8-5enu.json` |
| Endpoint called | `https://data.cityofchicago.org/resource/ydr8-5enu.json` |
| Dataset id | `ydr8-5enu` |
| Access | SODA, no key. Issued permits 2006–present, voided/revoked excluded. Catalog `data_updated_at` 2026-11-03. |
| Geography | City of Chicago. |
| Company name | Not a company column. `contact_1_type` … `contact_15_type` plus `contact_N_name` (“full name”). Types include `ELECTRICAL CONTRACTOR` (261,787 historical as contact 1; 7,341 with `issue_date` after 2024-01-01) and `CONTRACTOR-ELECTRICAL`, `CONTRACTOR-GENERAL CONTRACTOR`, `SIGN CONTRACTOR`. Since 2024-01-01, 11,404 contractor-type contact-1 names match `LLC`/`INC`/`CORP`. Many names will be people. Kliseer must drop person names. No firm-name column to do that cleanly. |
| Date | `issue_date` ISO. Drop nulls. |
| Record id | `id` (unique database id) or `permit_` |
| Source URL | No per-record URL in the schema. Description points at `http://www.chicago.gov/permit`. Dataset page is the source URL until a record link is found. |
| Commercial vs residential | No commercial flag. `permit_type` values fetched: `PERMIT – EXPRESS PERMIT PROGRAM` (326,592), `PERMIT - EASY PERMIT PROCESS`, `PERMIT - RENOVATION/ALTERATION`, `PERMIT - NEW CONSTRUCTION`, `PERMIT - SIGNS`, plus elevator, wrecking, porch. `work_description` is the job text. |
| License | Views metadata `licenseId`: `SEE_TERMS_OF_USE`. Terms story `https://data.cityofchicago.org/stories/s/9w6z-3n2k` redirected to login. Terms text not fetched. |
| Check | Grouped `contact_1_type` and counted electrical-contractor rows. Records returned. Names not pulled. |

### Chicago — Contracts — `live-tested` (public awards, not permits)

| | |
|---|---|
| Page | `https://data.cityofchicago.org/Administration-Finance/Contracts/rsxa-ify5` |
| Endpoint called | `https://data.cityofchicago.org/resource/rsxa-ify5.json` |
| Dataset id | `rsxa-ify5` |
| Access | SODA, no key. Procurement Services. 1993–present. Daily. Catalog `data_updated_at` 2026-11-04. |
| Geography | City of Chicago contracts only. Not private commercial jobs. |
| Company name | `vendor_name` |
| Date | `approval_date` ISO. Also `start_date`. Drop nulls. |
| Record id | `purchase_order_contract_number` plus `revision_number` |
| Source URL | `contract_pdf` is a URL column (catalog). Not selected in the sample. Do not invent the PDF path. |
| Signal | `purchase_order_description`, `contract_type`, `procurement_type`, `award_amount`. Construction types fetched: `CONSTRUCTION-LARGE $3MILLIONorABOVE` (8,808), `CONSTRUCTION-AVIATION` (7,008), `CONSTRUCTION-GENERAL` (3,468), `CONSTRUCTION` (1,791), plus `WORK SERVICES / FACILITIES MAINT.` |
| Check | Latest rows whose description contains `CONSTRUCT`: vendor `ROOT BROTHERS.MANUFACTURING & SUPPLY CO.` (commodities, 2026-10-30) and `D'ESCOTO, INC.` (arch/engineering, 2026-10-20). Filter `contract_type` to construction types before treating a row as a building job. |

### Dallas — Building Permits — `live-tested`

| | |
|---|---|
| Page | `https://www.dallasopendata.com/Services/Building-Permits/e7gq-4sah` |
| Endpoint called | `https://www.dallasopendata.com/resource/e7gq-4sah.json` |
| Dataset id | `e7gq-4sah` |
| Access | SODA, no key. Domain is `www.dallasopendata.com`, not `data.dallascityhall.com` (that host was not a hit). Catalog: official, automated, daily. Contact `ODP@dallascityhall.com`. |
| Geography | City of Dallas. |
| Company name | `contractor` exists, but it is one concatenated string (business, street, phone). Do not store the raw string. Parse a business token or skip until a cleaner field exists. Phone was present in the sample; not copied here. |
| Date | `issued_date` is `MM/DD/YY` text (`01/01/18` in the sample), not ISO. Usable only after a parser. Drop blanks. |
| Record id | `permit_number` |
| Source URL | None in the row. Dataset page only. |
| Commercial vs residential | `permit_type` and `land_use`. Group counts included `Commercial Electrical Permit` (17,713) and `Electrical (EL) Commercial  Alteration` (5,852). 5,877 `Commercial Electrical Permit` rows have both `contractor` and `issued_date`. Also large residential plumbing/electrical volume. |
| Check | `$limit=1` returned a row with `contractor`, `issued_date`, `permit_type`, `work_description`, `land_use`. Count query above returned `5877`. |

### Los Angeles — two datasets, only one has a company

**Issued permits `pi9x-tg5x` — `validated`, weak**

Catalog: `https://data.lacity.org/City-Infrastructure-Service-Requests/Building-and-Safety-Building-Permits-Issued-from-2/pi9x-tg5x`. Id `pi9x-tg5x`. Department of Building and Safety. Weekly. `data_updated_at` 2026-11-02. Columns include `permit_nbr`, `issue_date`, `permit_type`, `permit_sub_type`, `work_desc`, `status_desc`, `use_desc`. No contractor, applicant, or business name. Not a lead source. Resource endpoint not called, so not `live-tested`.

**Certificate of Occupancy `3f9m-afei` — `live-tested`, late signal**

Found in `https://api.us.socrata.com/api/catalog/v1?domains=data.lacity.org&only=datasets&limit=15&q=contractor`. Endpoint called: `https://data.lacity.org/resource/3f9m-afei.json`. `contractors_business_name` and `applicant_business_name` exist. `permit_sub_type` includes `Commercial` and `1 or 2 Family Dwelling`. `issue_date` ISO. Id: `pcis_permit`. Sample included `OWNER-BUILDER` and `CIRKS CONSTRUCTION INC` on a `Bldg-Alter/Repair` / `Commercial` row. This is occupancy, not the permit application. Many owner-builders. Use only if a later commercial occupancy signal is wanted. No per-record city URL in the selected fields.

### Orlando — Permit Applications — `live-tested` (not on the priority list; stronger than several listed cities)

| | |
|---|---|
| Page | `https://data.cityoforlando.net/Permitting/Permit-Applications/ryhf-m453` |
| Endpoint called | `https://data.cityoforlando.net/resource/ryhf-m453.json` |
| Dataset id | `ryhf-m453` |
| Access | SODA, no key. Description: applications updated daily. Catalog `data_updated_at` 2026-11-03. |
| Geography | City of Orlando. |
| Company name | `contractor_name` returned a business (`HOME ENERGY GROUP LLC, D/B/A ARCXIS`). Also `private_provider_company_name`. `contractor` is a separate column (not selected). Phone column exists; not requested. |
| Date | `issue_permit_date` ISO. Sample 2026-11-03. Drop nulls. |
| Record id | `permit_number` |
| Source URL | Not in the selected fields. |
| Commercial vs residential | `application_type`, `worktype` (`New` in the sample). No commercial flag confirmed. Sample project name looks like a subdivision lot. |
| Check | One issued row with non-null `contractor_name`. |

### Baltimore — ArcGIS Hub, not Socrata — `validated`, weak

`https://data.baltimorecity.gov/` is Open Baltimore (ArcGIS Hub). Socrata catalog on that host: HTTP 404.

Hub search returned city item “Housing and Building Permits 2015 to 2018”, owner `baltimore_city`, license CC-BY-3.0. Feature service fetched: `https://services1.arcgis.com/UWYHeuuJISiGmgXx/arcgis/rest/services/Housing_and_Building_Permits__2015_to_2018/FeatureServer/0?f=pjson`.

Fields: `CaseNumber`, `Description`, `IssuedDate`, `ExpirationDate`, `Address`, `ExistingUse`, `ProposedUse`, `Cost`, `Neighborhood`, `Council_District`, `csm_projname`. No contractor, company, applicant, or firm field. Coverage stated as 2015–2018. Not a current lead source.

Regional layer also listed, not row-tested: Baltimore Metropolitan Council “Building Permit Data System (BPDS)”, quarterly, last update stated 2026-10-08, service `https://services5.arcgis.com/viVzbt0JWVlYD2i9/arcgis/rest/services/BPDS_2025/FeatureServer`. Field dictionary is an xlsx linked from the hub description. Company name not confirmed. Terms say do not sell the data. Do not integrate until fields are fetched.

### Texas ESBD — HTML awards — `validated`, no API seen

Solicitations: `https://www.txsmartbuy.gov/esbd`. Public, no sign-in. Rows are open bids (title, solicitation id, due date, status). No awardee on that list. Includes construction titles (street rehab, plaza renovation) mixed with unrelated buys.

Awards with no solicitation: `https://www.txsmartbuy.gov/esbdawards`. `Vendor Name` and `Award Date` are on the page. Record path observed: `/esbdawards/{po}`. No API documented on the page. Awards seen were commodities and services, not a construction filter. Vendor phones and emails are on the page; do not ingest them. Statewide Texas public purchases, not building permits, not a national feed.

### California open data — searched, empty

`https://data.ca.gov/api/3/action/package_search?q=construction+contract&rows=5` returned `count: 0`.

---

## Listed or failed — not a dataset

| Place | What was opened | Result |
|---|---|---|
| Boston | `https://data.boston.gov/`, `https://data.boston.gov/dataset/approved-building-permits`, `https://data.boston.gov/api/3/action/package_search?q=building+permits` | HTTP 403. Discovery `search_context=data.boston.gov` HTTP 404. Not confirmed Socrata. No dataset id. |
| Denver | `https://data.denvergov.org/api/catalog/v1?q=building%20permits` redirected to `https://denvergov.org/opendata` and was rejected (WAF, Support ID 5820143489227599956). Discovery `search_context=data.denvergov.org` HTTP 404. ArcGIS hub `owner:denver` building-permits search returned 0. | No dataset id. |
| Philadelphia | `https://data.phila.gov/api/catalog/v1?q=building%20permits` HTTP 403. `https://opendataphilly.org/search/?q=building%20permits` and `https://www.opendataphilly.org/dataset?q=building%20permit` HTTP 404. `https://metadata.phila.gov/` title only (“Loading…”). `https://cityofphiladelphia.github.io/carto-api-explorer/` is a JS shell, no table names. | No dataset id. Do not guess a Carto table. |
| `data.dallascityhall.com` | Not the portal that served permits. | Use Dallas card above. |
| San Diego County contractors | Socrata ids `4ju2-mf55` and `76h4-nnmj` have `ContractorCompanyName` / `Constractor Company Name` (typo on the new id) and daily BLDS text. Domain on both catalog records: `internal-sandiegocounty.data.socrata.com`. | Internal host. Not a public integration target. Not called. |
| Marin County `mkbn-caye` | Seen in federated catalog JSON only. Columns include `contractor`, `issued_date`, `permit_number`, `description`. Page `https://data.marincounty.gov/d/mkbn-caye`. Daily, 2014–present, residential or commercial, county jurisdiction. | `validated` catalog only. Not row-tested. Smaller than the city feeds above. |
| Howard County `kvz2-j5cj` | Catalog only. Yearly issued permits. Columns are permit number, type, dates, zip. No company. | Weak. Not called. |
| `https://permitdata.org/` | Fetch redirected to `mobojo.com` and returned HTTP 403. | Publisher list not confirmed. |
| Chicago terms story | Login wall. | See Chicago card. |

---

## Ranked shortlist

1. **Austin `3syk-w9eu`.** Best next integration. One SODA row already has a business name, an electrical-trade filter, a commercial flag, an ISO issue date, a permit id, a work description, a status, and a city permit URL. No join. No key. Public-domain terms were fetched. Geography is Austin only — do not describe it as US-wide. It beats Seattle because the company field is a company column and the trade is filterable. It beats San Francisco because SF needs a join and contact dates are often null. It beats Chicago because Chicago’s name slot is “full name,” not a firm. It beats Dallas because Dallas dates are `MM/DD/YY` and the contractor cell embeds a phone.

2. **Seattle `76t5-zqzr` on `cos-data.seattle.gov`.** Same SODA shape, public domain, daily, commercial class, per-record URL, already returned 2026 issued commercial firms. Add a junk-name filter. No electrical-trade column.

3. **San Francisco join `3pee-9qhc.firm_name` + `i98e-djp9.issued_date`.** Clean firm names and a `contractor` role. Drop rows with null issue date. Weekly contacts, not daily. Two datasets.

4. **Chicago permits `ydr8-5enu` only if a firm-vs-person rule exists.** Electrical-contractor volume is real (7,341 contact-1 rows since 2024). Without that rule it violates the NYC “no person names” rule. Chicago contracts `rsxa-ify5` are the better public-award feed (`vendor_name`, construction `contract_type`, daily) but they are city vendors, not the electrician on a private job.

5. **Dallas `e7gq-4sah` later.** Commercial electrical rows with a contractor and a date exist (5,877). Do not ingest until the date parser and the phone-stripping parser exist.

6. **Orlando `ryhf-m453` if the priority list expands.** Company name and ISO issue date already returned. Commercial split not confirmed.

Do not integrate next: LA issued permits (no company), LA certificates of occupancy (late, owner-builder), Baltimore 2015–2018 (no company), Boston/Denver/Philadelphia (no confirmed dataset), San Diego internal Socrata, Census BPS, ESBD HTML (no API, awards are not a construction feed).

## What RAE would not improve

RAE was not run.

- Austin, Seattle, San Francisco, Chicago, Dallas, Orlando, and LA certificates of occupancy already return JSON. RAE does not add fields that are absent (LA issued permits, Baltimore 2015–2018, Chicago firm name).
- Boston HTTP 403 and the Denver WAF are access blocks. RAE does not pass them.
- Philadelphia’s metadata page and Carto explorer are JS shells. No public HTML table was confirmed, so there is nothing for RAE to parse. Hypothesis only, if a later public table is found.
- Texas ESBD awards are already readable HTML with vendor name and award date. Missing piece is an API and a construction filter, not a scraper.
- `www.sfdbi.org/dbipts` is named by DataSF as a permit lookup. The open-data join already has firm and permit text. RAE on that site would not beat the SODA join.
