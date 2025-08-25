const issueBody = process.argv[2]

// Ejemplo simple: verifica que el issue tenga al menos 50 caracteres
if (!issueBody || issueBody.length < 50) {
  console.log('ERROR: El issue tiene poca información.')
  // Para comunicar el error, podrías:
  process.exit(1) // El workflow fallará
} else {
  console.log('El issue tiene suficiente información.')
}
