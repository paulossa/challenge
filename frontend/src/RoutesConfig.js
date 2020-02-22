export default {
  products: () => '/produtos', 
  productsEdit: (productId=":id") => `/produtos/${productId}`,
  sales_promotion: () => '/ofertas', 
  store: () => '/loja',
}