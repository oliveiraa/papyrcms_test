import React, { useContext } from 'react'
import Error from 'next/error'
import { userContext } from '@/context'
import { PostsForm, Input } from '@/components'

type Props = {
  values: any
  errors: any
  validateField: Function
  handleChange: Function
}

const ProductFields = ({
  values,
  errors,
  validateField,
  handleChange,
}: Props) => (
  <div className="u-form-row">
    <Input
      id="price"
      label="Price"
      name="price"
      value={values.price || 0.0}
      onChange={handleChange}
      validation={errors.price}
      onBlur={validateField}
      type="number"
      required
    />

    <Input
      id="quantity"
      label="Stock Quantity"
      name="quantity"
      value={values.quantity || 0}
      validation={errors.quantity}
      onBlur={validateField}
      onChange={handleChange}
      type="number"
      required
    />
  </div>
)

const StoreNew = () => {
  const { currentUser } = useContext(userContext)
  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <PostsForm
      pageTitle="New Product"
      apiEndpoint="/api/store/products"
      redirectRoute="/store"
      additionalFields={[ProductFields]}
      additionalState={{
        price: 0.0,
        quantity: 0,
      }}
    />
  )
}

export default StoreNew
