// migrate-vue.js
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const file = process.argv[2]
if (!file) {
  console.error('Usage: node migrate-vue.js path/to/file.vue')
  process.exit(1)
}

const src = fs.readFileSync(file, 'utf8')

// Извлекаем <script>...</script>
const match = src.match(/<script[^>]*>([\s\S]*?)<\/script>/)
if (!match) {
  console.error('❌ No <script> block found in file')
  process.exit(1)
}

const scriptContent = match[1].trim()
const tempFile = path.join(process.cwd(), 'temp.js')
fs.writeFileSync(tempFile, scriptContent)

// Запускаем jscodeshift
execSync(`npx jscodeshift -t migrate.js ${tempFile} --parser=babel`, { stdio: 'inherit' })

// Читаем результат и вставляем обратно
const transformed = fs.readFileSync(tempFile, 'utf8')
const newSrc = src.replace(/<script[^>]*>[\s\S]*?<\/script>/, `<script setup>\n${transformed}\n</script>`)
fs.writeFileSync(file.replace('.vue', '.migrated.vue'), newSrc)

fs.unlinkSync(tempFile)
console.log(`✅ Migrated: ${file} → ${file.replace('.vue', '.migrated.vue')}`)
