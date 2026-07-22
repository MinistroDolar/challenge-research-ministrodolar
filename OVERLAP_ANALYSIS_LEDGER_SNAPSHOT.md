# Análisis de overlap: propuesta "Ledger Snapshot" (CoBuilders) vs ecosistema Canton Dev Fund

Fecha del análisis: 2026-07-22 (v2, actualizado tras leer el draft real de la propuesta).
Autor: análisis competitivo para CoBuilders, previo a presentar el DPM component "Ledger Snapshot" (dpm ledger-snapshot) al Canton Development Fund.

## Fuentes: qué se pudo verificar y qué no

- **Propuesta propia**: leída completa. No estaba en el repo local; se leyó el Google Doc "Ledger Snapshot DPM Component" (ID `1YSqCnC85N1EpnfzB04ZY9AlKnKGlhrU_IiDt2g9coy8`, draft del 2026-07-19, status "need Champion (Jatin?)").
- **PR #18, sus milestones, el código del devkit y el PR #520**: verificados directamente (GitHub, incluidos los patches de commits).
- **Doc oficial de casos de uso DPM**: leído completo vía conector de Google Drive.
- **Posts del foro #8822 (anuncio DPM Components) y #8412 (encuesta)**: NO accesibles desde este entorno. La política de red bloquea `forum.canton.network` y el mirror `discuss.daml.com` (403 a nivel proxy, verificado). No se inventa su contenido; lo citado de la encuesta es de segunda mano (snippets de buscador) y está marcado como tal. Ojo: la propuesta nuestra cita ese post de la encuesta dos veces como justificación de demanda; hay que verificarlo desde una red sin bloqueo antes de presentar.

## Resumen ejecutivo

**Nuestra propuesta tiene dos mitades con destinos opuestos.** El Milestone 1 (Sandbox, restore por rebuild lógico vía Ledger API: re-upload de DARs, re-allocation de parties, recreación de ACS) es una franja genuinamente libre: nadie la entregó, nadie la tiene en scope, y el mecanismo es distinto de todo lo existente. El Milestone 2 (LocalNet, restore por "stop writers + restore DB/volumes") duplica en mecanismo y en resultado lo que BitDynamics ya entregó y cobró en el devkit (PR #18, M1, cerrado), y ese mismo slot ya fue eliminado de otra propuesta en curso (#520) por overlap, con Srikanth de BitDynamics como champion, dos días antes de la fecha de creación de nuestro draft. Tal como está escrito, el M2 no sobrevive un review; reescrito como integración sobre el snapshot del devkit, la propuesta entera queda defendible.

---

## Evidencia por fuente

### Nuestra propuesta (draft real, leído)

Puntos que definen el perfil de overlap:

- Alcance: "save and restore named local ledger checkpoints for deterministic testing on Sandbox and LocalNet", con comandos save, restore, list/describe/delete, status, conformance, test hook y config, y distribución como DPM component vía OCI.
- Garantía: "an equivalent developer-visible ledger state" (parties, packages, ACS), explícitamente NO una copia exacta ("Does not guarantee: identical timestamps, ledger offsets... including contract IDs after logical sandbox rebuild").
- Dos backends con estrategias distintas:
  - Sandbox: "Logical rebuild: pause/restart sandbox, re-upload/vet DARs, re-allocate parties, recreate ACS from snapshot, conformance". Ledger-level, vía HTTP JSON / Ledger API.
  - LocalNet: "Infra restore: require persistent Postgres, stop writers, restore DB/volumes (documented layout), restart, optional PQS reset hook, conformance". Infra-level, Postgres.
- Milestones: M1 Sandbox MVP (2-3 semanas), M2 LocalNet + OCI (4 semanas), M3 adopción/GTM (1-2 semanas). PoC en bash contra Sandbox con restore "work in progress" y `--target local` stubbeado.
- Estado competitivo: **needs-champion** (draft, "need Champion (Jatin?)"). La sección "Rationale" responde "why not Console" y "why not LocalNet platforms", pero **nunca nombra al devkit de BitDynamics**, que es el incumbente real.

### PR #18 (canton-foundation/canton-dev-fund): aprobado, con M1 y M2 entregados

Fuente: https://github.com/canton-foundation/canton-dev-fund/pull/18

- "Proposal: Canton devkit (dpm component) - a unified toolkit for Canton app development (LocalNet, dar helpers, etc)". Autor: zheli (BitDynamics). Estado: **merged el 13-may-2026**. 1.900.000 CC + 600.000 CC opcionales.
- El plan de M1 incluye "snapshot/restore capability" dentro del lifecycle de LocalNet, packaging DPM nativo y binarios standalone.
- Clasificación: **Approved/merged, con M1 y M2 entregados y cerrados** (abajo).

### Milestones del #18, uno por uno

| Issue | Título | Estado | ¿Toca snapshot? |
|---|---|---|---|
| [#386](https://github.com/canton-foundation/canton-dev-fund/issues/386) | Milestone 1: LocalNet Management, CLI | **Closed, "Done" en el board Dev Fund Milestones** (400.000 CC) | SÍ: "Snapshot and restore capabilities for saving and replaying LocalNet state", más OCI publishing y packaging DPM |
| [#387](https://github.com/canton-foundation/canton-dev-fund/issues/387) | Milestone 2: Web UI, Observability, DAR & Contract Tooling | **Closed, "Done"** | No. Trae "live ACS table, transaction timeline, contract detail drawer" (inspección de ACS, no snapshot de ACS) |
| [#388](https://github.com/canton-foundation/canton-dev-fund/issues/388) | Milestone 3: Token Faucets & Token Standard Tooling (CIP-0112) | Open | No |
| [#389](https://github.com/canton-foundation/canton-dev-fund/issues/389) | Milestone 4: Adoption Validation and Ecosystem Outreach | Open | No |
| [#391](https://github.com/canton-foundation/canton-dev-fund/issues/391) | Milestone 5: Optional Maintenance & Compatibility Extension | Open | No (mantenimiento y compatibilidad Splice) |

**Ningún milestone del #18 lleva el snapshot a Sandbox ni a nivel ACS/ledger.** Todo su snapshot vive en M1, entregado, para LocalNet, a nivel infraestructura.

### Código real del devkit: qué es de verdad su snapshot

Fuente: https://github.com/bitdynamics-ab/canton-devkit

- `internal/localnet/snapshot/snapshot.go`, textual: "A LocalNet keeps all of its state (ledger, contracts, parties, node identities/keys) in a single PostgreSQL container. So a snapshot is a logical `pg_dumpall` of that Postgres." Pausa los contenedores de nodos durante el dump ("Quiesce pauses every container of the project EXCEPT pgContainer so no node writes to Postgres while the dump runs"). Archivo .tgz con `snapshot.json`, `state.json` (registry) y `database/dumpall.sql`.
- **Infra-level (Docker + Postgres), no ledger-level**: no usa Ledger API ni exporta ACS. **Solo LocalNet**: cero menciones a Sandbox en código, README y docs.
- CLI real (`internal/cli/localnet/snapshot.go`): dos comandos, `snapshot [name] --to <file.tgz>` y `restore [name] --from <file.tgz> [--force]`. **No hay snapshot list, delete, describe ni status**; los snapshots son archivos sueltos, no un store nombrado.
- Limitación documentada (`docs/limitations.md`): "restore requires the target instance to already exist (was up at least once)". El restore levanta un Postgres descartable y reaplica el dumpall completo.
- Fidelidad: al ser dump físico de Postgres, el restore del devkit preserva el estado exacto, **incluidos contract IDs y offsets**. Nuestro rebuild lógico de Sandbox no (equivalencia, no identidad). Esto corta para los dos lados (ver objeción 3).
- Testing (`docs/e2e-testing.md`): snapshot/restore aparece solo como ítem del test scope de M1. **No hay flujo documentado de snapshot-per-test ni hook**. Sí hay integración CI genérica (README: `--format json`, exit codes estables, workflow de GitHub Actions).
- Distribución: ya publican `oci://ghcr.io/bitdynamics-ab/canton-devkit:latest` (README, instalación vía DPM).

### PR #520: el slot "ledger-snapshot" ya se litigó y se cerró

Fuente: https://github.com/canton-foundation/canton-dev-fund/pull/520

- "Proposal: DPM Ledger Operations & Reproducible Testing Suite". Autor: rose2221. Estado: **Open, "In Review (Champion Assigned)"**. Champion: **srikanth-bitdynamics, auto-asignado el 20-jul-2026** (la movió de "Declined" a review). Clasificación: champion-confirmed en review, no aprobada ni pagada.
- Commits: `a3c07bf` (09-jul) propuesta original; `588703d` (17-jul) "Narrow scope to post-deployment operations and reproducible testing"; **`71ed0b0` (17-jul) "Drop ledger-snapshot milestone; defer to environment-level snapshot tooling"**.
- El patch de `71ed0b0` (leído vía `/commit/71ed0b0.patch`) eliminó un milestone casi calcado a nuestra propuesta:
  - Removido: "dpm snapshot save / restore / list / delete for sandbox and LocalNet, including persistent-storage configuration managed by the plugin."; "Hard guardrail refusing every snapshot operation against remote or production participants."; "A ledger snapshot plugin brings the Canton equivalent of Hardhat's `evm_snapshot` to local development".
  - Razón declarada: "overlaps approved BitDynamics DevKit M1 localnet snapshot/restore".
  - Agregado: "For repeatable campaign state, test campaigns integrate with environment-level snapshot/restore where available (e.g. DevKit's `dpm localnet snapshot`) rather than shipping a snapshot mechanism of their own."
- Scope de testing que quedó (patch de `588703d`): run journal ("Every run driven through the suite ... is automatically recorded into a structured, append-only journal: the submitted command inputs, resulting create/archive events, party visibility, and abort/assert messages") con replay exacto desde el journal, y tests table-driven (`dpm test --table <module>:<script> --rows rows.json`). Explícitamente: "the suite deliberately builds neither a generator library nor a fuzzing engine". $300.000 en 6 milestones.
- Lectura clave: su record-replay reproduce **submissions**, no revierte estado; el rollback de estado lo delegan por diseño en el devkit. Y la cronología importa: **eliminaron su ledger-snapshot el 17-jul; nuestro draft está fechado 19-jul**.

### Lo que pidió la Foundation

- Post #8822: inaccesible desde este entorno (ver arriba). No se cita.
- Doc oficial de casos de uso (leído completo, doc "DPM Component Use Cases List for the Community"), texto exacto:

  > "**Ledger Snapshot Plugin** (categoría Local Development): Checkpoint ledger state, run a test suite, and roll back the Canton equivalent of Hardhat's `evm_snapshot`. Set up the initial party and contract state once, save it, and run multiple test passes without re-bootstrapping the node. This will require adding a persistent approach to the LocalNet postgres servers."

  Observaciones: el pedido oficial es checkpoint + rollback para suites de test sin re-bootstrapping, con implementación esperada vía **persistencia de los Postgres de LocalNet**. **No menciona Sandbox ni nivel ACS.** La implementación Postgres/LocalNet del devkit calza con la letra de ese pedido.
- Encuesta #8412: inaccesible. Señal de segunda mano (snippets de búsqueda): "Local Development Frameworks" calificados como la necesidad más crítica. Nuestra propuesta la cita como evidencia de demanda; verificar el texto antes de presentar.

---

## A. Cuadro de overlap por capacidad (contra el draft real)

Estados: **Cubierto** (entregado o en scope aprobado), **Parcial**, **Libre**. Columna #520 refleja el scope vigente (post `71ed0b0`).

| Capacidad del draft | vs #18 devkit | vs #520 | Cita |
|---|---|---|---|
| save (Sandbox, ledger-level) | **Libre**: devkit no toca Sandbox ni Ledger API para snapshot | **Libre**: lo eliminaron | `snapshot.go` (solo Postgres/LocalNet); patch `71ed0b0` |
| restore (Sandbox, rebuild lógico) | **Libre**: mecanismo inexistente en el ecosistema | **Libre** | Ídem |
| save (LocalNet) | **Cubierto, entregado y pagado**: `localnet snapshot --to` hace exactamente lo que nuestro M2 describe (parar writers, dump de Postgres) | Libre (delegado al devkit) | #386 closed/Done; `snapshot.go`; nuestro draft: "Infra restore: require persistent Postgres, stop writers, restore DB/volumes" |
| restore (LocalNet) | **Cubierto, entregado**: `localnet restore --from`, mismo mecanismo; además preserva contract IDs exactos, cosa que nuestro Sandbox rebuild no | Libre (delegado al devkit) | `internal/cli/localnet/snapshot.go`; `docs/limitations.md` |
| list / describe / delete (store nombrado en `.ledger-snapshots/`) | **Libre**: devkit tiene solo 2 comandos y archivos .tgz sueltos | Libre: el milestone muerto de #520 los incluía y ya no existe | `internal/cli/localnet/snapshot.go`; patch `71ed0b0` |
| status | **Libre** (el `localnet status` del devkit es del stack, no de snapshots) | Libre | README devkit |
| conformance (diff live vs snapshot de parties/packages/ACS) | **Libre**: el devkit inspecciona ACS (M2, explorer) pero no compara contra un snapshot | **Libre**: #520 renunció a motores de verificación ("neither a generator library nor a fuzzing engine") | #387; patch `588703d` |
| test hook (`ledger-snapshot test --snapshot <name> -- <cmd>`) | **Parcial**: no existe el hook, pero su CI integration (`--format json`, exit codes, GH Action) + snapshot/restore lo compone con un script | **Parcial/en disputa**: #520 posee la narrativa de testing reproducible y declara integrarse con el snapshot del devkit para estado de campañas | `docs/e2e-testing.md`; patch `71ed0b0` |
| target Sandbox | **Libre** | **Libre** (el único que lo proponía lo eliminó) | Repo devkit completo sin menciones a Sandbox |
| target LocalNet | **Cubierto** (ver B) | Delegado al devkit explícitamente | #386; `snapshot.go` |
| distribución OCI | **Cubierto como mecanismo** (canal estándar DPM, no diferenciador): ya publican `oci://ghcr.io/bitdynamics-ab/canton-devkit:latest` | Mismo canal | README devkit; #386 "OCI publishing" |

Mapeo por milestone del draft: **M1 (Sandbox MVP) es 100% franja libre. M2 (LocalNet + OCI) es el milestone atacable: su núcleo (restore Postgres de LocalNet) está cubierto y pagado; lo residual (store nombrado, hook, conformance, PQS hook) es delta fino sobre lo del devkit. M3 (GTM) no genera overlap.**

## B. El punto más peligroso: LocalNet, y ahora con agravante

**Sí, el snapshot/restore ya entregado del devkit cubre nuestro target LocalNet, y el draft agrava el problema porque propone el mismo mecanismo.** Evidencia de código, no de propuesta:

- Devkit (`snapshot.go`): quiesce de contenedores + `pg_dumpall` + restore reaplicando el dump. Milestone #386 cerrado y "Done": aceptado y pagado.
- Nuestro draft, LocalNet: "require persistent Postgres, stop writers, restore DB/volumes (documented layout), restart". Es la misma operación con otro empaquetado (checkpoints nombrados locales en vez de .tgz portable).
- Y la letra del pedido oficial (doc de casos de uso) describe el componente como "a persistent approach to the LocalNet postgres servers": exactamente lo que el devkit implementó.

La defensa "lo nuestro es ledger-level y lo de ellos es infra-level" **solo vale para Sandbox**. En LocalNet nuestro propio draft es infra-level. Peor: en fidelidad, el restore del devkit es superior en LocalNet (estado exacto, contract IDs y offsets incluidos), mientras nuestra garantía es equivalencia sin contract IDs. Los huecos reales del devkit en LocalNet (sin store nombrado, sin list/delete, restore que exige instancia preexistente, sin hook de test) son ergonomía que Srikanth puede absorber en mantenimiento (M5, #391, abierto).

## C. Dónde NO hay overlap: la franja limpia

1. **Sandbox completo (nuestro M1)**: `dpm sandbox` es Canton in-memory; el enfoque pg_dumpall no aplica y el devkit no lo toca en ninguna parte del repo. #520 era el único que lo proponía ("for sandbox and LocalNet") y lo eliminó. El rebuild lógico vía Ledger API (re-upload/vet DARs, re-allocate parties, recreate ACS) no existe en ningún deliverable ni scope vigente del ecosistema revisado.
2. **Store gestionado de snapshots** (nombrados, list/describe/delete/status, manifest versionado): inexistente en el devkit; el único que lo proponía (milestone muerto de #520) ya no existe.
3. **Conformance post-restore** (diff de parties/packages/ACS contra el snapshot): nadie lo entrega ni lo tiene en scope; #520 renunció explícitamente a motores de verificación.
4. **Test hook empaquetado** (`test --snapshot <name> -- <cmd>`): no existe como producto, aunque es componible con piezas existentes, así que es defendible solo como parte del paquete, no como diferenciador solo.

Advertencia: la franja Sandbox excede la letra del doc oficial de casos de uso (que solo habla de LocalNet Postgres). La justificación de demanda descansa en la encuesta (#8412), que no pudimos verificar desde este entorno.

## D. ¿Coincidimos con lo que pidió la Foundation?

Con la salvedad del post #8822 (inaccesible), contra el doc oficial de casos de uso:

- Nombre y framing coinciden con el pedido: "Ledger Snapshot Plugin", Hardhat `evm_snapshot`, "run multiple test passes without re-bootstrapping". Nuestro draft usa exactamente ese lenguaje. A favor: el componente pedido con ese nombre **no fue construido como componente standalone por nadie**; el devkit entregó un archive de entorno dentro de su lifecycle de LocalNet.
- En contra: la única implementación que el doc oficial menciona ("persistent approach to the LocalNet postgres servers") es la parte que el devkit ya cubrió. Nuestra parte Sandbox va más allá de la letra del doc (defendible como espíritu del pedido: "roll back... run a test suite" aplica igual a Sandbox, el entorno local más usado).
- Conformance, store nombrado y test hook no aparecen en el doc: son additions nuestras. Ninguna contradice el pedido, pero no podemos presentarlas como "lo que la Foundation pidió".

## E. Las 3 objeciones más fuertes de un reviewer (en particular Srikanth)

1. **"El Milestone 2 re-implementa lo que ya entregamos y cobramos."** DevKit M1 (#386, cerrado, Done) hace parar-writers + dump/restore de Postgres en LocalNet; nuestro M2 describe la misma operación, y encima con fidelidad menor o igual. Sin reescritura, esta objeción es letal para M2. **Respuesta posible solo si M2 se convierte en integración**: consumir `dpm localnet snapshot/restore` del devkit como backend y aportar lo que no existe (store nombrado, conformance, hook, PQS hook). Tal como está el draft, no tiene respuesta.
2. **"Este slot ya se litigó hace cinco días: miren #520."** El commit `71ed0b0` (17-jul) eliminó "dpm snapshot save / restore / list / delete for sandbox and LocalNet" citando textual "overlaps approved BitDynamics DevKit M1 localnet snapshot/restore", y nuestro draft (19-jul) propone la misma superficie de comandos para los mismos dos targets. Un proponente ya pagó ese precio para sobrevivir; el comité sería inconsistente aprobándonos lo mismo. **Respuesta parcial**: lo que #520 eliminó era save/restore genérico sin implementación diferenciada; nuestro M1 Sandbox (rebuild lógico vía Ledger API) es justamente lo que el pg_dumpall no puede hacer, y hasta completa la frase de #520 "environment-level snapshot/restore where available": para Sandbox hoy no hay ninguno disponible. Pero la respuesta solo funciona si LocalNet deja de ser deliverable propio.
3. **"Su 'equivalencia' no es determinismo: después del restore cambian los contract IDs; mi restore de Postgres preserva el estado exacto. Y el ángulo de testing reproducible ya tiene dueño: la propuesta #520 que yo championeo."** Doble filo técnico y político. Técnico: tests que persisten contract IDs fuera del ledger fallan tras nuestro rebuild lógico; hay que documentar la garantía con precisión (el draft ya lo hace, mantenerlo prominente) y responder que en Sandbox no existe alternativa con fidelidad exacta, porque es in-memory. Político: #520 (run journal + replay + table-driven) posee la narrativa de testing; nuestra pieza debe presentarse como el eslabón de estado que a #520 le falta (su journal reproduce submissions, no revierte estado), no como suite de testing propia. La palabra "conformance" conviene mantenerla acotada a "post-restore verification" para no invadir su territorio.

## F. Veredicto binario

**SÍ hay hueco real y defendible, pero solo si se corta el M2 tal como está escrito.** El M1 (Sandbox) está limpio: mecanismo nuevo, target no cubierto, slot vacante incluso después de la poda de #520. El M2 (LocalNet vía stop-writers + restore de Postgres/volúmenes) duplica trabajo entregado y pagado, con el precedente de eliminación por overlap más fresco del repo (cinco días antes de nuestro draft) y con el dueño del trabajo duplicado como champion activo de la propuesta vecina.

**Encuadre de una línea que sobrevive:**

> "dpm ledger-snapshot lleva el checkpoint/rollback estilo `evm_snapshot` a donde hoy no existe ninguno, el Sandbox in-memory de `dpm`, mediante rebuild lógico vía Ledger API con verificación de conformance; en LocalNet no reimplementa nada: orquesta `dpm localnet snapshot/restore` del devkit de BitDynamics como backend y le agrega el store nombrado, el test hook y la conformance que el devkit no tiene."

**Cambios concretos al draft antes de presentar:**
1. Reescribir el M2: de "Offline restore path: stop LocalNet writers, restore database/volume state, restart" a "LocalNet backend delegado al devkit" (invocar su CLI o librería; contribuir upstream si hace falta). Es la misma jugada con la que #520 sobrevivió, y convierte a Srikanth de objetor en dependencia halagada.
2. Agregar una sección explícita de overlap analysis nombrando al devkit y a #520: hoy el Rationale responde "why not Console" y "why not LocalNet platforms" pero no nombra al incumbente real; un reviewer lo va a leer como omisión deliberada.
3. Mantener el nombre "Ledger Snapshot" (es el nombre oficial del componente en el doc de la Foundation y nadie lo construyó como componente standalone), pero subtitular con el diferenciador ("sandbox-first, ledger-level checkpoints") para despegarse del snapshot de entorno del devkit.
4. Mantener y destacar la honestidad de la garantía (equivalencia, no identidad de contract IDs): es la respuesta preparada a la objeción técnica 3.
5. Verificar desde una red sin bloqueo los posts #8412 (citado dos veces en el draft como evidencia de demanda) y #8822: este análisis no pudo abrirlos.
6. Buscar champion cuanto antes: el draft está needs-champion ("Jatin?") mientras el campo contrario ya tiene champion activo (Srikanth en #520 desde el 20-jul).

## Registro de fuentes

- Propuesta CoBuilders: Google Doc "Ledger Snapshot DPM Component" (ID `1YSqCnC85N1EpnfzB04ZY9AlKnKGlhrU_IiDt2g9coy8`), leído completo vía conector de Drive
- https://github.com/canton-foundation/canton-dev-fund/pull/18 (propuesta devkit, merged 13-may-2026)
- https://github.com/canton-foundation/canton-dev-fund/issues/386 (M1, closed/Done: snapshot/restore LocalNet, OCI)
- https://github.com/canton-foundation/canton-dev-fund/issues/387 (M2, closed/Done: ACS table sin snapshot)
- https://github.com/canton-foundation/canton-dev-fund/issues/388, /389, /391 (M3, M4, M5: sin snapshot)
- https://github.com/bitdynamics-ab/canton-devkit (README; docs/limitations.md; docs/faq.md; docs/e2e-testing.md; internal/localnet/snapshot/snapshot.go; internal/cli/localnet/snapshot.go)
- https://github.com/canton-foundation/canton-dev-fund/pull/520 y commits a3c07bf, 588703d, 71ed0b0 (patches vía `/commit/<sha>.patch`)
- Google Doc oficial "DPM Component Use Cases List for the Community" (ID `1TCkM0Cq4bxIct55wvfZLmr720yhiUCXskN3AKX99lcY`), leído completo vía conector de Drive
- https://forum.canton.network/t/dpm-components-extend-the-canton-developer-stack/8822: NO accesible (bloqueo de red del entorno)
- https://forum.canton.network/t/canton-network-developer-experience-and-tooling-survey-analysis-2026/8412: NO accesible (ídem); señal secundaria vía buscador: "Local Development Frameworks" como necesidad más crítica
