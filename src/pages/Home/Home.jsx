import React from 'react'
import { useRecoilState } from 'recoil'
import { suppliersDataState } from '../../store/supplier/supplierAtom'
// import { qualitiesDataState } from '../../store/supplier/supplierAtom'

const Home = () => {
  const [data , setData] = useRecoilState(suppliersDataState)

  // const [data2 , setData2] = useRecoilState(qualitiesDataState)
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <h1 className='font-font2 font-[600] text-[4rem] '>Welcome back Taylor &#128075;</h1>
      <div>
        {JSON.stringify(data)}
        {/* {JSON.stringify(data2)} */}
      </div>
    </div>
  )
}

export default Home
