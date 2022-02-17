const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect('/login');
    }
    next();
  };

  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };
   
//StockList helper
//   isSelected: function (Stock, key) {
//     return Stock === key ? 'selected' : ''; 
// }
  
  module.exports = {isLoggedIn,isLoggedOut};