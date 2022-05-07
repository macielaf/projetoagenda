const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body){
    this.body = body;
    this.errors = []; // se houver algum erro ele vai ser adicionado aqui
    this.user = null;
  }

async login(){
  this.valida();
  if(this.errors.length > 0) return; // Se houver algum erro, nao valida nem registra.
  this.user = await LoginModel.findOne({ email: this.body.email });

  if(!this.user){
    this.errors.push('Usuario não exite');
    return;
  }

  if(!bcryptjs.compareSync(this.body.password, this.user.password)){
    this.errors.push('Senha inválida.')
    this.user = null;
    return;
  }

}

 async register(){
    this.valida();
    if(this.errors.length > 0) return; // Se houver algum erro, nao valida nem registra.
    
   await this.userExists();
  //verifica novamente pq o valida recebe os dados purros do usuario. Nao quero que passe de la
  // Mas se passar, ele chaca na base de dados com email se este usuario existe
   if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    
      
      this.user = await LoginModel.create(this.body);
 }
  
async  userExists(){
   const user = await LoginModel.findOne({ email: this.body.email });
   if(user){
     this.errors.push('Usuario ja existe');
   }
  }

  // validando os campos
  valida(){
    this.cleanUp();
    // email precisa ser valido - INstale um pacote chamado validator que é para isso.
    if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
    
    // seha precisa ter entre 3 a 20 caracteres
    if(this.body.password.length < 3 || this.body.password.length > 50){
      this.errors.push('Senha inválida. Precisa estar entre 3 e 50 caracteres');
    }
  }

  cleanUp(){
    // Percorrer meu body para verificar se todos os campos são do typo string
    for(const key in this.body){
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    //Aqui eu garanto que meu objeto vai ter apenas os campos que eu quero.
  this.body = {
    email: this.body.email,
    password: this.body.password
  };
  
  }
}

module.exports = Login;
