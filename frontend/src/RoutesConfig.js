export default {
  products: () => '/produtos', 
  productsEdit: (productId=":id") => `/produtos/${productId}`,
  productsNew: () => `/produtos/novo`,
  sales_promotion: () => '/ofertas', 
  store: () => '/loja',
}