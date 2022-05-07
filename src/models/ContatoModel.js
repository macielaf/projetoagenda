const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: {type: Date, default: Date.now},
  
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato (body){
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
   this.contato = await ContatoModel.create(this.body);
};

  // validando os campos
  Contato.prototype.valida = function() {
    this.cleanUp();
    // email precisa ser valido - INstale um pacote chamado validator que é para isso.
    if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatorio');
    if(!this.body.email && !this.body.telefone){
      this.errors.push('Pelo menos um contato precisa ser enviado: Email ou telefone.')
    }
    
  }

  Contato.prototype.cleanUp = function(){
    // Percorrer meu body para verificar se todos os campos são do typo string
    for(const key in this.body){
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    //Aqui eu garanto que meu objeto vai ter apenas os campos que eu quero.
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
    
  };
 };

 Contato.prototype.edit = async function(id){
   if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    // isso diz. Quando vc me retornar os dados, me retorne os ddos atualizados não os antigos
    // Os dados do novo contato agora ficam aqui para depois serem atualizados
    this.contato =  await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });

   }

//Metodos estaticos, são os que não vão para o prototype. Não acessa this

// ou vai me reotornar um usuario ou vai me reotornar null
Contato.buscaPorId = async function(id){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
}

Contato.buscaContatos = async function(){
  // quero ordernar na ordem que foram criados.
  // aqui pode filtrar alguns campos.
  const contatos = await ContatoModel.find()
  .sort({ criado: -1 });
  return contatos;
}

Contato.delete = async function(id){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id })
  return contato;
}

module.exports = Contato;
