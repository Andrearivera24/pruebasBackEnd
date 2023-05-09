//---------------------------------------------IMPORTANTE, CAMBIAR TODO A CART.----------------------------------------------------------------------------------
// trabajando con módulos.
import fs from "fs";

export default class CartManager {
  //--> exporto la clase.
  #id = 0; //  variable privada.
  constructor(path) {
    //--> La ruta como parámetro, para luego al instanciar la clase, pasarle la ruta real.
    this.path = path;
    // valido que no exista el archivo, y luego lo escribo creando un array vacío.
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }
  //---------------------------------addCart (crea un carrito con { id : id, products = []}) ------------------------------------------------------------------
  ////La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
  // Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
  // products: Array que contendrá objetos que representen cada producto
  async addCart(arrayProducts) {
    try {
      const newCart = { products: [arrayProducts] }; // paso la lista de productos al objeto.
      newCart.id = this.#getID(); // le asigno id autoincrementable
      const cartsAct = await this.getCarts(); //obtengo el archivo con los carritos actuales, llamando a getCarts()
      cartsAct.push(newCart); // Agrego el nuevo producto a la lista anterior

      //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsAct));
      return cartsAct;
    } catch (err) {
      console.log(`Algo salió mal al intentar agregar un carrito ERROR:${err}`);
    }
  }
  //--------------------------------- Método privado para incrementar en uno la variable privada ---------------------------------------------------------------
  #getID() {
    this.#id++; //
    return this.#id;
  }
  //-------------------------------- Método getCarts (retorna los carritos parseados) -----------------------------------------------------------------
  async getCarts() {
    try {
      const cartsAct = await fs.promises.readFile(this.path, "utf-8"); //leo y guardo en variable los productos
      const cartsActParseados = JSON.parse(cartsAct); // Retorno los productos parseados.
      return cartsActParseados;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener los carritos parseados, ERROR: ${err}`
      );
    }
  }
  //------------------------------------- getProductsByidCart (devuelve la lista de productos del carro con el id solicitado). -----------------------------------------------------------------------
  // esta función la uso en La ruta GET /:cid
  async getProductsByidCart(idCart) {
    try {
      const cartsAct = await this.getCarts(); // -->  Obtengo los carts parseados con el método que ya sabe cómo hacerlo.
      //El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
      const idcartFound = await cartsAct.find((cart) => cart.id === idCart);

      const productsList = idcartFound.products; // del cart con id solicitado, devuelvo la lista de productos.
      return productsList;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener la lista de productos del idCart especificado, ERROR: ${err}`
      );
    }
  }

  //---------------------------------Metodo addProdToIdCart ------------------------------------------------------------------------------------

  //"La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
  //product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo), quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

  async addProdToIdCart(idCart, idProduct, objeto) {
    // (req.params.cid, req.params.cid, req.body)

    try {
      // creo el objeto product = [ {product: id (idProduct) , quantity: objeto.quantity} ] 
      const product = 
        {
          product: idProduct,
          quantity: objeto.quantity
        }
      

      console.log(product);

      const productsList = await this.getProductsByidCart(idCart); // obtengo la lista de productos del idCart específicado llamando al método que ya sabe cómo hacerlo 
      console.log(productsList);   
      console.log(await productsList.push({product}));
        
 
      const cartsAct = await this.getCarts(); // obtengo todos los carritos
      // reescribo la lista de productos con los cambios.
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartsAct.productsList)
      );
    } catch (err) {
      console.log(
        `Algo salió mal al agregar un producto al cart con id: ${idCart}, ERROR: ${err}`
      );
    }
  }
}

//----------------------- CREO UNA INSTRANCIA DE LA CLASE Y HAGO LAS PRUEBAS CON UNA FUNCIÓN ASÍNCRONA -------------------------

const carts = new CartManager("./carts.json"); // le paso a ruta.

const pruebas = async () => {
  try {
    //agrego los carritos
    // await carts.addCart({id : 1, tile : "Producto 1 ", description : "Esta es la 1 prueba para ver si funciona crear productos en un carrito"})
    // await carts.addCart({id : 2, tile : "Producto 2 ", description : "Esta es la 2 prueba para ver si funciona crear productos en un carrito"})
    // await carts.addCart({id : 3, tile : "Producto 3 ", description : "Esta es la 3 prueba para ver si funciona crear productos en un carrito"})
    // obtengo la lista de producsot del carrito con id 1. debería ser {tile : "Producto 1 ", description : "Esta es la 1 prueba para ver si funciona crear productos en un carrito"}
    //console.log( await carts.getProductsByidCart(3));
    await carts.addProdToIdCart(1, 1, {quantity : 5}); //
  } catch (err) {
    console.log(
      `Algo salió mal al hacer las pruebas del Cart Manager, ERROR: ${err}`
    );
  }
};

pruebas(); // ejecuto las pruebas
