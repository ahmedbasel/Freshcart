import { IProduct } from "./iproduct"

export interface ICartProduct {
  count: number
  _id: string
  product: IProduct
  price: number
}
