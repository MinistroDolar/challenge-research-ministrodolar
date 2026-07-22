# Análisis de overlap: propuesta "Ledger Snapshot" (CoBuilders) vs ecosistema Canton Dev Fund

Fecha del análisis: 2026-07-22.
Autor: análisis competitivo para CoBuilders, previo a presentar el DPM component "Ledger Snapshot" (dpm ledger-snapshot) al Canton Development Fund.

## Advertencias de fuentes (leer primero)

1. **La propuesta propia no estaba en el disco.** El archivo `./Ledger_Snapshot_Propuesta_draft.md` no existe en este repo ni en su historial de git (el repo solo contiene análisis de bridges EVM). Este informe usa como definición de scope la lista de capacidades del brief: save, restore, list/describe/delete, status, conformance, test hook, target Sandbox, target LocalNet, distribución OCI. Si el draft real difiere, hay que re-chequear el cuadro.
2. **Los dos posts del foro son inaccesibles desde este entorno.** La política de red bloquea `forum.canton.network` y también el mirror `discuss.daml.com` (403 en el CONNECT del proxy, verificado). No pude leer el post #8822 (anuncio de DPM Components) ni el #8412 (análisis de la encuesta). No invento su contenido: lo que se cita de la encuesta es de segunda mano (snippets de buscador) y está marcado como tal.
3. **El doc oficial de casos de uso sí se pudo leer completo** vía el conector de Google Drive, y contiene la descripción oficial del "Ledger Snapshot Plugin". Se cita textual abajo.

## Resumen ejecutivo (veredicto adelantado)

**El núcleo de nuestra propuesta (save/restore en LocalNet) está cubierto por trabajo ya aprobado, entregado y cerrado (devkit de BitDynamics, PR #18, Milestone 1), y el slot "ledger-snapshot" ya fue litigado y cerrado una segunda vez: el PR #520 tuvo que eliminar exactamente ese componente por overlap con el devkit, con Srikanth de BitDynamics como champion.** Hay una franja libre real pero angosta: snapshot con target Sandbox y semántica de rollback rápido estilo `evm_snapshot`/`evm_revert` dentro del loop de test, más la gestión de snapshots (list/describe/delete). Tal como está planteada, la propuesta no sobrevive un review; recortada a esa franja, sí tiene un hueco defendible.

---

## Evidencia por fuente

### PR #18 (canton-foundation/canton-dev-fund): aprobado y pagado en su núcleo

Fuente: https://github.com/canton-foundation/canton-dev-fund/pull/18

- Título: "Proposal: Canton devkit (dpm component) - a unified toolkit for Canton app development (LocalNet, dar helpers, etc)". Autor: zheli (BitDynamics). Estado: **merged el 13-may-2026**. 1.900.000 CC + 600.000 CC opcionales de mantenimiento.
- El Milestone 1 incluye explícitamente "snapshot/restore capability" dentro del lifecycle de LocalNet, junto con packaging nativo como DPM component y binarios standalone.
- Clasificación: **Approved/merged**, con M1 y M2 además **entregados y cerrados** (ver abajo).

### Milestones del #18, uno por uno

| Issue | Título | Estado | ¿Toca snapshot? |
|---|---|---|---|
| [#386](https://github.com/canton-foundation/canton-dev-fund/issues/386) | Milestone 1: LocalNet Management, CLI | **Closed, "Done" en el project board Dev Fund Milestones** | SÍ: "Snapshot and restore capabilities for saving and replaying LocalNet state". También OCI publishing y packaging DPM. 400.000 CC. |
| [#387](https://github.com/canton-foundation/canton-dev-fund/issues/387) | Milestone 2: Web UI, Observability, DAR & Contract Tooling | **Closed, "Done"** | No. Trae "live ACS table, transaction timeline, contract detail drawer" (inspección, no snapshot). |
| [#388](https://github.com/canton-foundation/canton-dev-fund/issues/388) | Milestone 3: Token Faucets & Token Standard Tooling (CIP-0112) | Open | No. |
| [#389](https://github.com/canton-foundation/canton-dev-fund/issues/389) | Milestone 4: Adoption Validation and Ecosystem Outreach | Open | No. |
| [#391](https://github.com/canton-foundation/canton-dev-fund/issues/391) | Milestone 5: Optional Maintenance & Compatibility Extension | Open | No (mantenimiento y compatibilidad Splice; sin features nuevas de snapshot). |

Conclusión: **ningún milestone del #18 lleva el snapshot a Sandbox ni a nivel ACS/ledger.** Todo el snapshot del devkit vive en M1, que ya se entregó, para LocalNet, a nivel infraestructura.

### Código real del devkit: qué es de verdad su snapshot

Fuente: https://github.com/bitdynamics-ab/canton-devkit

- `internal/localnet/snapshot/snapshot.go` dice textual: **"A LocalNet keeps all of its state (ledger, contracts, parties, node identities/keys) in a single PostgreSQL container. So a snapshot is a logical `pg_dumpall` of that Postgres."** Pausa los contenedores de nodos durante el dump ("Quiesce pauses every container of the project EXCEPT pgContainer so no node writes to Postgres while the dump runs"). El archivo .tgz contiene `snapshot.json` (metadata), `state.json` (registry) y `database/dumpall.sql`.
- Veredicto técnico: **es infra-level (Docker + Postgres pg_dumpall), NO ledger-level (no usa Ledger API ni exporta ACS).** Cero menciones a Sandbox en el código, README o docs: **solo LocalNet**.
- CLI real (`internal/cli/localnet/snapshot.go`): solo dos comandos, `snapshot [name] --to <file.tgz>` y `restore [name] --from <file.tgz> [--force]`. **No existe snapshot list, delete, describe ni status.** Los snapshots son archivos sueltos, no un store gestionado.
- Limitación documentada (`docs/limitations.md`): "**`restore` requires the target instance to already exist (was `up` at least once)**". El restore levanta un Postgres descartable y reaplica el dumpall completo: es un restore pesado y portable, no un rollback instantáneo estilo `evm_revert`.
- Testing (`docs/e2e-testing.md`): snapshot/restore aparece solo como ítem del test scope de M1. **No hay ningún flujo documentado de "snapshot antes de la suite, restore entre casos"**, ni hook de test. Sí hay integración CI genérica (README: `--format json`, exit codes estables, workflow de GitHub Actions incluido).
- Distribución: ya publican como DPM component vía **`oci://ghcr.io/bitdynamics-ab/canton-devkit:latest`** (README, sección de instalación DPM).

### PR #520: el slot "ledger-snapshot" ya se cerró una vez por overlap

Fuente: https://github.com/canton-foundation/canton-dev-fund/pull/520

- Título: "Proposal: DPM Ledger Operations & Reproducible Testing Suite". Autor: rose2221. Estado: **Open, "In Review (Champion Assigned)"**. Champion: **srikanth-bitdynamics, auto-asignado el 20-jul-2026** (la movió de "Declined" a review). Clasificación: **champion-confirmed en review, no aprobada ni pagada**.
- Historial de commits (pestaña /commits): `a3c07bf` (09-jul) propuesta original; `588703d` (17-jul) "Narrow scope to post-deployment operations and reproducible testing"; **`71ed0b0` (17-jul) "Drop ledger-snapshot milestone; defer to environment-level snapshot tooling"**.
- El patch de `71ed0b0` (visto vía https://github.com/canton-foundation/canton-dev-fund/commit/71ed0b0.patch) eliminó un milestone que era casi idéntico a nuestra propuesta. Texto removido:
  - "**dpm snapshot save / restore / list / delete for sandbox and LocalNet, including persistent-storage configuration managed by the plugin.**"
  - "Hard guardrail refusing every snapshot operation against remote or production participants."
  - "A ledger snapshot plugin brings the Canton equivalent of Hardhat's `evm_snapshot` to local development".
  - Razón declarada: **"overlaps approved BitDynamics DevKit M1 localnet snapshot/restore"**.
  - Texto agregado: "**For repeatable campaign state, test campaigns integrate with environment-level snapshot/restore where available (e.g. DevKit's `dpm localnet snapshot`) rather than shipping a snapshot mechanism of their own.**"
- Lo que quedó en scope de testing (patch de `588703d`): un **run journal** ("Every run driven through the suite ... is automatically recorded into a structured, append-only journal: the submitted command inputs, resulting create/archive events, party visibility, and abort/assert messages"), con **replay exacto desde el journal** ("recorded runs are replayed exactly from their journal entries"), y tests table-driven (`dpm test --table <module>:<script> --rows rows.json`). Explícitamente: "the suite deliberately builds neither a generator library nor a fuzzing engine". Presupuesto final: $300.000 en 6 milestones.
- Lectura clave: el record-replay de #520 reproduce **submissions** (comandos), no estado; el rollback de estado lo delega por diseño en el snapshot del devkit. Juntas, las dos piezas de BitDynamics componen la historia completa de "testing reproducible".

### Lo que pidió la Foundation

- Post del foro #8822: **inaccesible desde este entorno** (bloqueo de red, ver advertencias). No puedo citar su texto exacto y no lo invento.
- Doc oficial de casos de uso (leído completo vía Google Drive, doc "DPM Component Use Cases List for the Community", ID `1TCkM0Cq4bxIct55wvfZLmr720yhiUCXskN3AKX99lcY`), texto exacto del componente:

  > "**Ledger Snapshot Plugin** (categoría Local Development): Checkpoint ledger state, run a test suite, and roll back the Canton equivalent of Hardhat's `evm_snapshot`. Set up the initial party and contract state once, save it, and run multiple test passes without re-bootstrapping the node. This will require adding a persistent approach to the LocalNet postgres servers."

  Observaciones: la Foundation lo enmarca como **checkpoint + rollback para correr suites de test sin re-bootstrapping**, y su implementación esperada es **persistencia de los Postgres de LocalNet**. **No menciona Sandbox. No menciona nivel ACS.** Es decir: la implementación Postgres/LocalNet del devkit calza con la letra del pedido oficial.
- Encuesta #8412: inaccesible. Señal de segunda mano (snippets de búsqueda): los "Local Development Frameworks" fueron calificados como la necesidad más crítica. Sin acceso al post no puedo afirmar que haya demanda medida específica de snapshot/rollback.

---

## A. Cuadro de overlap por capacidad

Estados: **Cubierto** (ya entregado o en scope aprobado), **Parcial**, **Libre**. La columna #520 refleja el scope vigente (post commit 71ed0b0).

| Capacidad nuestra | vs #18 devkit (y milestones) | vs #520 | Cita |
|---|---|---|---|
| save | **Cubierto (LocalNet, entregado y pagado)**: `localnet snapshot --to` | Libre (lo eliminaron) | #386 "Snapshot and restore capabilities..."; `internal/cli/localnet/snapshot.go` |
| restore | **Cubierto (LocalNet, entregado)**: `localnet restore --from`, con limitación "target instance must already exist" | Libre (lo eliminaron) | `docs/limitations.md`; `internal/cli/localnet/snapshot.go` |
| list / describe / delete | **Libre**: el devkit NO tiene estos subcomandos, sus snapshots son .tgz sueltos sin store gestionado | Libre: el milestone eliminado los incluía ("save / restore / list / delete") y ya no existe | `internal/cli/localnet/snapshot.go` (solo 2 comandos); patch 71ed0b0 |
| status (de snapshots) | **Libre** (el `localnet status` existente es del stack, no de snapshots) | Libre | README, tabla de comandos |
| conformance | **Libre** en ambos, pero ojo: nadie lo pidió; #520 dice explícitamente "neither a generator library nor a fuzzing engine" y el doc de casos de uso no lo menciona para este componente | Libre | patch 588703d; doc de casos de uso |
| test hook (restore entre pasadas de test) | **Parcial**: el devkit no documenta un flujo snapshot-per-test, pero su CI integration (`--format json`, exit codes, GH Action) + snapshot/restore lo componen con un script trivial | **Parcial/en disputa**: #520 posee la narrativa de testing reproducible (run journal + replay exacto + table-driven) y declara integrarse con el snapshot del devkit para el estado de campañas | `docs/e2e-testing.md`; README; patch 588703d y 71ed0b0 |
| target Sandbox | **Libre**: cero menciones a Sandbox en código y docs del devkit; solo LocalNet | **Libre**: el único que lo proponía ("for sandbox and LocalNet") lo eliminó | `snapshot.go`; README; patch 71ed0b0 |
| target LocalNet | **Cubierto y entregado** (el punto B abajo) | Delegado al devkit explícitamente | #386 cerrado "Done"; `snapshot.go` |
| distribución OCI | **Cubierto como mecanismo**: el devkit ya publica `oci://ghcr.io/bitdynamics-ab/canton-devkit:latest`; OCI es el canal estándar DPM, no un diferenciador | N/A (mismo canal estándar) | README devkit, #386 ("OCI publishing") |

## B. El punto más peligroso: LocalNet ya está cubierto, con evidencia de código

**Sí, el snapshot/restore ya entregado del devkit cubre nuestro target LocalNet.** No es una claim de propuesta, es código mergeado y milestone cerrado:

- `internal/localnet/snapshot/snapshot.go`: "A LocalNet keeps all of its state (ledger, contracts, parties, node identities/keys) in a single PostgreSQL container. So a snapshot is a logical `pg_dumpall` of that Postgres." Con quiesce de contenedores para consistencia y archivo portable (.tgz con dumpall + registry).
- Issue #386 (Milestone 1) está **Closed y "Done"** en el project board: ese trabajo está aceptado y pagado (400.000 CC).
- Y lo más importante: aunque su snapshot es infra-level (Postgres) y no ledger-level (ACS), **eso es exactamente lo que la Foundation describió** en el doc de casos de uso ("This will require adding a persistent approach to the LocalNet postgres servers"). Argumentar "lo nuestro es ACS-level, lo de ellos es Postgres-level" no nos salva en LocalNet: el pedido oficial se satisface con la implementación Postgres, y el resultado funcional (guardar estado inicial, correr tests, restaurar) es el mismo para el usuario.

Los huecos reales del deliverable entregado son menores: no hay list/describe/delete/status, el restore exige que la instancia ya exista, y no hay un hook de test empaquetado. Son mejoras incrementales al devkit, no un componente nuevo, y Srikanth puede cerrarlas en el M5 de mantenimiento.

## C. Dónde NO hay overlap: la franja limpia

Existe, y es **Sandbox + semántica de rollback rápido en el loop de test + gestión de snapshots**:

1. **Sandbox (`dpm sandbox`)**: el devkit es LocalNet-only por diseño (repo entero sin una mención a Sandbox; README: "supports only LocalNet deployments"). `dpm sandbox` es un Canton in-memory de un solo participant (docs de Digital Asset), así que el enfoque pg_dumpall del devkit ni siquiera aplica: se necesita otra mecánica (configurar persistencia del sandbox o export/import a nivel ledger). #520 era el único que proponía snapshot "for sandbox and LocalNet" y lo **eliminó** en 71ed0b0; su scope restante (JSON Ledger API + PQS, post-deployment) no lo toca.
2. **Semántica `evm_snapshot`/`evm_revert` real**: checkpoint barato, múltiples snapshots nombrados, revert instantáneo invocable desde el test. El devkit tiene un archive pesado y portable con restore que reaplica un dumpall completo sobre una instancia existente: sirve para "volver al estado semilla", no para "revert entre cada caso de test". Nadie entregó ni tiene en scope la versión rápida.
3. **Gestión (list/describe/delete/status)**: inexistente en el devkit; el único que la proponía (el milestone muerto de #520) ya no existe.

Advertencia: la franja es real pero angosta, y la parte Sandbox va más allá de la letra del doc oficial de casos de uso (que solo habla de LocalNet). Hay que justificarla con demanda (la encuesta, que no pude leer) y con factibilidad técnica.

## D. ¿Coincidimos con lo que pidió la Foundation?

Con la salvedad de que el post #8822 no se pudo abrir, contra el doc oficial de casos de uso la respuesta es incómoda:

- **La mitad de nuestro scope que coincide con lo pedido (checkpoint + rollback en LocalNet vía persistencia Postgres) es exactamente la mitad que el devkit ya entregó.**
- **La mitad que no está cubierta (Sandbox, conformance, store gestionado) es la mitad que la Foundation no pidió**: el texto oficial no menciona Sandbox, ni ACS, ni conformance, ni gestión de snapshots. "Conformance" en particular no aparece en ninguna fuente y #520 renunció explícitamente a todo lo que huela a generadores/fuzzing.
- Conclusión: tal como está, la propuesta o duplica lo entregado o excede lo pedido. Para sobrevivir hay que reencuadrar la parte no pedida como la evolución natural del caso de uso oficial ("run multiple test passes without re-bootstrapping" hoy no es posible en Sandbox, y en LocalNet el restore no es un revert de test).

## E. Las 3 objeciones más fuertes de un reviewer (Srikanth)

1. **"Esto ya está entregado y pagado."** DevKit M1 (#386, cerrado, Done) incluye "Snapshot and restore capabilities for saving and replaying LocalNet state", y la implementación (persistencia/dump de Postgres de LocalNet) calza con la descripción oficial del componente en el doc de casos de uso. **Respuesta posible pero débil** si mantenemos LocalNet save/restore como deliverable: solo se responde cortándolo (ver F). Los huecos (list/delete, restore-sobre-instancia-existente, sin test hook) son chicos y él puede absorberlos en mantenimiento (M5, #391).
2. **"Este slot ya se litigó y se cerró: miren #520."** El commit 71ed0b0 eliminó "dpm snapshot save / restore / list / delete for sandbox and LocalNet" con la razón textual "overlaps approved BitDynamics DevKit M1 localnet snapshot/restore". Un proponente ya pagó ese precio; aprobar después lo mismo a otro sería inconsistente del comité. **Es la objeción más difícil y no tiene buena respuesta frontal**: la única salida es demostrar que lo nuestro NO es lo que se eliminó (el milestone muerto era save/restore genérico; lo defendible es la semántica de revert en test y Sandbox in-memory, que el pg_dumpall no puede dar). Nota: que hasta el milestone muerto de #520 (que incluía Sandbox) se haya considerado "overlapping" muestra que el comité trata "snapshot" como una palabra ya ocupada; el naming "Ledger Snapshot" juega en contra.
3. **"La parte de testing pisa la propuesta que yo championeo (#520)."** El ángulo "testing reproducible/determinístico" ya tiene dueño en review: run journal con replay exacto + tests table-driven, que además declara integrarse con el snapshot del devkit para el estado de campañas. Devkit (estado) + #520 (submissions) componen la historia completa. **Respuesta parcial y real**: record-replay reproduce comandos, no revierte estado; un checkpoint/revert dentro del test es complementario y hasta mejora #520 (su "environment-level snapshot where available" hoy no existe para Sandbox). Pero hay que presentarlo como pieza que encaja con #520, no como suite de testing propia, y cortar "conformance" que invade su territorio narrativo.

## F. Veredicto binario

**Sí hay hueco, pero NO con la propuesta como está.** El save/restore LocalNet y la distribución OCI están cubiertos por trabajo aprobado, entregado y pagado, y el componente "ledger-snapshot" genérico ya fue eliminado una vez de otra propuesta por overlap, con el dueño del devkit como champion.

**Encuadre de una línea que sobrevive:**

> "Checkpoint y revert instantáneos del ledger para `dpm sandbox` (donde hoy no existe ningún snapshot, porque el sandbox es in-memory) con semántica `evm_snapshot`/`evm_revert` invocable desde tests, más un store gestionado de snapshots (list/describe/delete); en LocalNet no reemplazamos nada: nos integramos con `dpm localnet snapshot/restore` del devkit como backend."

**Qué cortar o reescribir:**
- Cortar "save/restore para LocalNet" como deliverable propio; reescribirlo como integración con el devkit (misma jugada que hizo #520 para sobrevivir).
- Cortar "conformance": no lo pidió nadie, #520 lo excluyó a propósito, y nos mete en guerra con el champion.
- Renombrar o subtitular el componente para despegarse del término ya ocupado: el diferencial es "instant revert in-test para Sandbox", no "snapshot".
- Antes de presentar: conseguir el texto exacto del post #8822 y de la encuesta #8412 desde una red sin bloqueo, porque este análisis no pudo verificarlos.

## Registro de fuentes

- https://github.com/canton-foundation/canton-dev-fund/pull/18 (propuesta devkit, merged 13-may-2026, plan de milestones)
- https://github.com/canton-foundation/canton-dev-fund/issues/386 (M1, closed/Done, texto de snapshot/restore y OCI)
- https://github.com/canton-foundation/canton-dev-fund/issues/387 (M2, closed/Done, ACS table sin snapshot)
- https://github.com/canton-foundation/canton-dev-fund/issues/388, /389, /391 (M3 y M4 open sin snapshot; M5 mantenimiento)
- https://github.com/bitdynamics-ab/canton-devkit (README: tabla de comandos, OCI, CI; docs/limitations.md; docs/faq.md; docs/e2e-testing.md; internal/localnet/snapshot/snapshot.go; internal/cli/localnet/snapshot.go)
- https://github.com/canton-foundation/canton-dev-fund/pull/520 (propuesta, estado, champion) y sus commits a3c07bf, 588703d, 71ed0b0 (patches leídos vía /commit/<sha>.patch)
- Google Doc "DPM Component Use Cases List for the Community" (ID 1TCkM0Cq4bxIct55wvfZLmr720yhiUCXskN3AKX99lcY), leído completo vía conector de Drive
- https://forum.canton.network/t/dpm-components-extend-the-canton-developer-stack/8822: NO accesible (bloqueo de red del entorno)
- https://forum.canton.network/t/canton-network-developer-experience-and-tooling-survey-analysis-2026/8412: NO accesible (ídem); señal secundaria vía resultados de búsqueda: "Local Development Frameworks" como necesidad más crítica
