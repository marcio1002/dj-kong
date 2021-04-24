let localeProp

const setUpdate = (value) => {
  if(localeProp !== undefined && localeProp?.length)
    localeProp[0] = value
}

const useState = (prop) =>  {
  if(localeProp === undefined)
    return localeProp = [prop, setUpdate]
  else
    return localeProp
}

export { useState }