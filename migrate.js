/**
 * migrate.js
 * Полная миграция Vue 2 Options API → Vue 3 <script setup> для Nuxt 3
 * Поддержка props, emits, data, methods, computed, watch, hooks, замена this.*
 */

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  const imports = new Set()
  const setupBody = []
  const stateVars = new Set()

  const exportDefault = root.find(j.ExportDefaultDeclaration)
  if (!exportDefault.length) return file.source

  const options = exportDefault.get().node.declaration.properties || []

  // ---- PROPS ----
  const props = options.find(p => p.key?.name === 'props')
  if (props) {
    setupBody.push(
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('props'),
          j.callExpression(j.identifier('defineProps'), [props.value])
        ),
      ])
    )
    imports.add('defineProps')
  }

  // ---- EMITS ----
  const emits = options.find(p => p.key?.name === 'emits')
  if (emits) {
    setupBody.push(
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('emit'),
          j.callExpression(j.identifier('defineEmits'), [emits.value])
        ),
      ])
    )
    imports.add('defineEmits')
  }

  // ---- DATA ----
  const dataProp = options.find(p => p.key?.name === 'data')
  if (dataProp) {
    const returnStmt = dataProp.value.body.body.find(b => b.argument)?.argument
    if (returnStmt && returnStmt.properties) {
      const propsList = returnStmt.properties.map(p => p.key.name)
      propsList.forEach(v => stateVars.add(v))

      setupBody.push(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier('state'),
            j.callExpression(j.identifier('reactive'), [
              j.objectExpression(returnStmt.properties),
            ])
          ),
        ])
      )
      imports.add('reactive')
    }
  }

  // ---- COMPUTED ----
  const computedProp = options.find(p => p.key?.name === 'computed')
  if (computedProp) {
    imports.add('computed')
    computedProp.value.properties.forEach(c => {
      setupBody.push(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(c.key.name),
            j.callExpression(j.identifier('computed'), [
              j.arrowFunctionExpression([], c.value.body),
            ])
          ),
        ])
      )
    })
  }

  // ---- WATCH ----
  const watchProp = options.find(p => p.key?.name === 'watch')
  if (watchProp) {
    imports.add('watch')
    watchProp.value.properties.forEach(w => {
      const key = w.key.name || w.key.value
      setupBody.push(
        j.expressionStatement(
          j.callExpression(j.identifier('watch'), [
            j.arrowFunctionExpression(
              [],
              j.memberExpression(j.identifier('state'), j.identifier(key))
            ),
            w.value
          ])
        )
      )
    })
  }

  // ---- METHODS ----
  const methodsProp = options.find(p => p.key?.name === 'methods')
  if (methodsProp) {
    methodsProp.value.properties.forEach(m => {
      const func = j.functionDeclaration(
        j.identifier(m.key.name),
        m.value.params,
        m.value.body
      )

      // Заменяем this.* на state.*
      j(func)
        .find(j.MemberExpression, { object: { type: 'ThisExpression' } })
        .forEach(expr => {
          const key = expr.node.property.name
          if (stateVars.has(key)) {
            expr.replace(
              j.memberExpression(j.identifier('state'), j.identifier(key))
            )
          } else {
            expr.replace(j.identifier(key))
          }
        })

      setupBody.push(func)
    })
  }

  // ---- LIFECYCLE HOOKS ----
  const lifecycleMap = {
    created: 'onBeforeMount',
    mounted: 'onMounted',
    beforeDestroy: 'onBeforeUnmount',
    destroyed: 'onUnmounted',
    updated: 'onUpdated',
  }

  for (const [key, vueHook] of Object.entries(lifecycleMap)) {
    const hook = options.find(p => p.key?.name === key)
    if (hook) {
      imports.add(vueHook)

      // также заменяем this.*
      j(hook)
        .find(j.MemberExpression, { object: { type: 'ThisExpression' } })
        .forEach(expr => {
          const key = expr.node.property.name
          if (stateVars.has(key)) {
            expr.replace(
              j.memberExpression(j.identifier('state'), j.identifier(key))
            )
          } else {
            expr.replace(j.identifier(key))
          }
        })

      setupBody.push(
        j.expressionStatement(
          j.callExpression(j.identifier(vueHook), [hook.value])
        )
      )
    }
  }

  // ---- ИМПОРТЫ ----
  if (imports.size > 0) {
    root.get().node.program.body.unshift(
      j.importDeclaration(
        Array.from(imports).map(i => j.importSpecifier(j.identifier(i))),
        j.literal('vue')
      )
    )
  }

  // ---- УДАЛЯЕМ export default ----
  exportDefault.remove()

  // ---- ДОБАВЛЯЕМ setup тело ----
  root.get().node.program.body.push(...setupBody)

  return root.toSource({ quote: 'single', trailingComma: true })
}
