const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('./db');

function signAdmin(admin){ return jwt.sign({sub: admin.id, email: admin.email, role:'admin'}, process.env.JWT_SECRET, {expiresIn:'8h'}); }
function authRequired(req,res,next){
  try {
    const token = req.cookies.vinix_admin;
    if(!token) return res.status(401).json({error:'Não autenticado'});
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { return res.status(401).json({error:'Sessão inválida ou expirada'}); }
}
async function ensureAdmin(){
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if(!email || !password) return;
  const found = await query('SELECT id FROM admins WHERE email=$1',[email]);
  if(found.rowCount === 0){
    const hash = await bcrypt.hash(password, 12);
    await query('INSERT INTO admins(email,password_hash) VALUES($1,$2)',[email,hash]);
  }
}
module.exports = { signAdmin, authRequired, ensureAdmin };
