const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    // console.log(req.session.user)
   return res.render('login') // Isso manda renderizar a pagina de login que esta na views
}

//ISso agora pode ser usado no meu Model para ser consumido o body que foi enviado para o html

exports.register = async function (req, res) {
   
    try{
        const login = new Login(req.body) // com isso ja foi instanciado o Login
        await login.register();
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
              return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Seu usuario foi criado com sucesso!');
            req.session.save(function() {
            return  res.redirect('back');
            });
    } catch(e) {
        console.log(e)
        return res.render('404')
    }
};

exports.login = async function (req, res) {
   
    try{
        const login = new Login(req.body) // com isso ja foi instanciado o Login
        await login.login();
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
              return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Usuário logado com sucesso.');
        //agora preciso jogar o usuario logado para dentro da sessao
        req.session.user = login.user;
            req.session.save(function() {
            return  res.redirect('back');
            });
    } catch(e) {
        console.log(e)
        return res.render('404')
    }
};

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
}