const { randomUUID } = require('crypto');
const path = require('path');
const { getStorageClient } = require('./storage');

const BUCKET = 'vinix-anexos';

async function enviarAnexo(file) {
  if (!file) return null;

  const extensoes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/pdf': '.pdf'
  };

  const extensao = extensoes[file.mimetype];
  if (!extensao) {
    throw new Error('Tipo de arquivo não permitido.');
  }

  const nomeArquivo = `${randomUUID()}${extensao}`;
  const supabase = getStorageClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nomeArquivo, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  return nomeArquivo;
}

async function excluirAnexo(nomeArquivo) {
  if (!nomeArquivo) return;

  const supabase = getStorageClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([nomeArquivo]);

  if (error) throw error;
}

module.exports = { enviarAnexo, excluirAnexo };
