require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('./db');
const { signAdmin, authRequired, ensureAdmin } = require('./auth');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const uploadDir = path.join(__dirname,'..','uploads');
fs.mkdirSync(uploadDir,{recursive:true});

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..','public')));
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req,file,cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`)
});
const allowed = new Set(['image/jpeg','image/png','image/webp','application/pdf']);
const upload = multer({
  storage,
  limits:{fileSize:Number(process.env.MAX_UPLOAD_MB || 5)*1024*1024},
  fileFilter:(req,file,cb)=> allowed.has(file.mimetype) ? cb(null,true) : cb(new Error('Tipo de arquivo não permitido'))
});

app.get('/api/health', async (req,res)=>{
  try { await query('SELECT 1'); res.json({status:'ok', service:'vinix'}); }
  catch { res.status(503).json({status:'error'}); }
});

app.post('/api/orcamentos', upload.single('attachment'), async (req,res,next)=>{
  try {
    const {name,phone,email,service,description} = req.body;
    if(!name || !phone || !email || !service || !description) return res.status(400).json({error:'Preencha todos os campos obrigatórios.'});
    const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await query(`INSERT INTO quote_requests(name,phone,email,service,description,attachment_path) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,created_at`,[name.trim(),phone.trim(),email.trim(),service.trim(),description.trim(),attachmentPath]);
    res.status(201).json({message:'Solicitação recebida com sucesso.', id:result.rows[0].id});
  } catch(err){ next(err); }
});

app.post('/api/admin/login', async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const result = await query('SELECT id,email,password_hash FROM admins WHERE email=$1',[email]);
    if(result.rowCount===0 || !(await bcrypt.compare(password,result.rows[0].password_hash))) return res.status(401).json({error:'E-mail ou senha inválidos.'});
    const token = signAdmin(result.rows[0]);
    res.cookie('vinix_admin',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000});
    res.json({message:'Login realizado.'});
  }catch(err){next(err)}
});
app.post('/api/admin/logout',(req,res)=>{res.clearCookie('vinix_admin');res.json({message:'Logout realizado.'})});
app.get('/api/admin/me',authRequired,(req,res)=>res.json({email:req.admin.email}));
app.get('/api/admin/orcamentos',authRequired,async (req,res,next)=>{
  try { const r=await query('SELECT id,name,phone,email,service,description,attachment_path,status,created_at FROM quote_requests ORDER BY created_at DESC'); res.json(r.rows); } catch(err){next(err)}
});
app.patch('/api/admin/orcamentos/:id',authRequired,async(req,res,next)=>{
  try{
    const allowedStatuses=['Pendente','Em análise','Orçamento enviado','Concluído'];
    if(!allowedStatuses.includes(req.body.status)) return res.status(400).json({error:'Status inválido.'});
    await query('UPDATE quote_requests SET status=$1 WHERE id=$2',[req.body.status,req.params.id]);
    res.json({message:'Status atualizado.'});
  }catch(err){next(err)}
});

app.get('/admin',(req,res)=>res.sendFile(path.join(__dirname,'..','public','admin.html')));
app.use((err,req,res,next)=>{ console.error(err); res.status(500).json({error: err.message || 'Erro interno'}); });

async function start(){
  await ensureAdmin();
  app.listen(PORT,()=>console.log(`Vinix rodando em http://localhost:${PORT}`));
}
if(require.main===module) start().catch(err=>{console.error(err);process.exit(1)});
module.exports=app;
