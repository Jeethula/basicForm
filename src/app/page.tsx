// "use client"
// import { useRouter } from 'next/navigation'
// import { FormEvent, useState } from 'react'

// export default function Home() {

//   const country = ["India", "USA", "UK", "Canada"];
//   const [inputdata,setInputData] = useState<any>([{education:""}]);

//   const router = useRouter();

//   async function Onsubmit(event:FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     if(formData.get("name") === "" || formData.get("email") === "" || formData.get("message") === "" || formData.get("country") === "") {
//       alert("Please fill all the fields");
//       return;
//     }

//     const oldData = localStorage.getItem("formData");
//     const parsedoldData = oldData ? JSON.parse(oldData) : [];
//     const newFormData = JSON.stringify(Object.fromEntries(formData.entries()));
//     parsedoldData.push(newFormData);
//     localStorage.setItem("formData", JSON.stringify(parsedoldData));
//     router.push("/data");
//   }

//   const addfields = () => {
//     let newinput = {education:""};
//     setInputData([...inputdata,newinput]);
//   }

//   const removefields = (index:any) => {
//     const values = [...inputdata];
//     values.splice(index,1);
//     setInputData(values);
//   }

  

//   return (
//     <main className="w-full bg-blue-200 h-screen flex flex-col items-center gap-y-5 py-10">
//       <h1 className="text-3xl font-bold text-black">BASIC FORM</h1> 
//       <form onSubmit={Onsubmit}  className="flex flex-col xl:w-[30%] w-[70%] bg-white p-7 rounded-lg gap-y-3 overflow-auto shadow-2xl ">
//         <label className="font-bold">Name</label>
//         <input type="text" name="name" className="border-2 px-1 rounded-md min-h-10" placeholder='Enter your name' />
//         <label className="font-bold" >Email</label>
//         <input type="email"  name="email" className="border-2 px-1 rounded-md min-h-10" placeholder='Enter your Email' />
//         <label className="font-bold">Message</label>
//         <textarea name="message" className="border-2 px-1 rounded-md min-h-20" placeholder='type your message'></textarea>
//         <label className="font-bold">country</label>
//         <select name="country" className="border-2 px-1 rounded-md min-h-10">
//           {country.map((con) => (
//             <option key={con} value={con}>
//               {con}
//             </option>
//           ))}
//         </select>
//         <label className="font-bold">Education</label>
//         <div>
//           {inputdata.map((data:any, index:any) => (
//             <div className='flex gap-x-2  items-center mb-4'>
//               <input key={index} type="text" name={`eduction${index}`} placeholder={`Education detail ${index+1}`} className="border-2 px-1 rounded-md min-h-10 w-full" />
//             { inputdata.length!==1 && <div className='cursor-pointer' onClick={removefields}>Remove</div>}
//             </div>
//           ))}
//           <h1 className='mt-3 font-medium underline cursor-pointer' onClick={addfields}>Add +</h1>
//         </div>
//         <button type="submit" className="h-fit w-fit p-2 bg-green-500 hover:bg-green-600 rounded-md font-bold mt-5">Submit</button>
//       </form>
//     </main>
//   );
// }
"use client"

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Country } from 'country-state-city';
import ReactSelect from 'react-select';

export default function Home() {
 // const country = ["India", "USA", "UK", "Canada"];
  const country:any = Country.getAllCountries().map((con) => con.name);
  const [fields, setFields] = useState<{[key: string]: string;
  }>({
    name: '',
    email: '',
    message: '',
    country: ''
  });
  const [error , setError] = useState({name:"",email:"",message:"",country:""});
  const [inputData, setInputData] = useState([{ education: "" }]);
  const [errorinput, setErrorInput] = useState({education:""});
  const [editData,setEditData] = useState(false);
  const [editIndex,setEditIndex]= useState(0);
  const [savechanges,setSaveChanges] = useState(false);

  const router = useRouter();

  useEffect(()=>{
    const edit = localStorage.getItem("edit");
    const index:any = localStorage.getItem("editIndex");
    if(edit){
      setEditData(JSON.parse(edit))
      setEditIndex(JSON.parse(index))
    }
    console.log("from effect")
  },[])


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let allfields = true;
    Object.keys(fields).forEach((key) => {
      if (!fields[key]) {
        setError((prev) => ({...prev, [key]: `Please fill the ${key}`}));
        allfields = false;
      }
    })
    inputData.forEach((data, index) => {
      if (!data.education) {
        setErrorInput((prev) => ({...prev, education: `Please fill the education detail ${index + 1}`}));
        allfields = false;
      }
    })
    if (!allfields) return;
    setSaveChanges(false);
    const oldData = localStorage.getItem("formData");
    const parsedOldData = oldData ? JSON.parse(oldData) : [];
    const newFormData = { ...fields, educations: inputData };
    parsedOldData.push(newFormData);
    localStorage.setItem("formData", JSON.stringify(parsedOldData));
    router.push("/data");
  }

  const addFields = () => {
    setInputData([...inputData, { education: "" }]);
  }

  const removeFields = (index: number) => {
    const values = [...inputData];
    values.splice(index, 1);
    setInputData(values);
  }

  const handleEducationChange = (index: number, value: string) => {
    const newInputData = [...inputData];
    newInputData[index].education = value;
    setInputData(newInputData);
  }


  if(editData ){
    const getdata:any = localStorage.getItem("formData");
    const parsedData = JSON.parse(getdata);
    const editFormData = parsedData[editIndex];
    const newData = parsedData.filter((_:any, i:any) => i !== editIndex); 
    localStorage.setItem("formData", JSON.stringify(newData));
    // console.log(editFormData,"111")
    // console.log(typeof editFormData,"222")
    setFields(editFormData);
    // setFields({name:editFormData.name,email:editFormData.email,message:editFormData.message,country:editFormData.country});
    setInputData(editFormData.educations);
    localStorage.removeItem("edit");
    localStorage.removeItem("editIndex");
    setSaveChanges(true);
    setEditData(false);
  }

  return (
    <main className="w-full bg-blue-200 min-h-screen flex flex-col items-center gap-y-5 py-10">
      <h1 className="text-3xl font-bold text-black">BASIC FORM</h1>
      <form onSubmit={onSubmit} className="flex flex-col xl:w-[30%] w-[70%] bg-white p-7 rounded-lg gap-y-3 overflow-auto shadow-2xl">
        <label className="font-bold">Name</label>
        <input
          type='text'
          className={`border-2 px-1 rounded-md min-h-10 ${error.name && 'border-red-500'}`}
          placeholder='Enter your name'
          value={fields.name}
          onChange={(e) => setFields({...fields, name: e.target.value})}
          onFocus={() => setError((prev) => ({...prev, name: ""}))}
        />
        {error.name && <p className="text-red-500">{error.name}</p>}
        <label className="font-bold">Email</label>
        <input
          type='email'
          className={`border-2 px-1 rounded-md min-h-10 ${error.email && 'border-red-500'}`}
          placeholder='Enter your Email'
          value={fields.email}
          onChange={(e) => setFields({...fields, email: e.target.value})}
          onFocus={() => setError((prev) => ({...prev, email: ""}))}
        />
        {error.email && <p className="text-red-500">{error.email}</p>}
        <label className="font-bold">Message</label>
        <textarea
           className={`border-2 px-1 rounded-md min-h-10 ${error.message && 'border-red-500'}`}
          placeholder='Type your message'
          value={fields.message}
          onChange={(e) => setFields({...fields, message: e.target.value})}
          onFocus={() => setError((prev) => ({...prev, message: ""}))}
        />
        {error.message && <p className="text-red-500">{error.message}</p>}
        <label className="font-bold">Country</label>
        {/* <ReactSelect value={fields.country} onChange={(e:any) => setFields({...fields, country: e.target.value})} options={Country.getAllCountries().map((con)=>con.name)} /> */}
        <select 
           className={`border-2 px-1 rounded-md min-h-10 ${error.country && 'border-red-500'}`} 
          value={fields.country}
          onChange={(e) => setFields({...fields, country: e.target.value})}
          onFocus={() => setError((prev) => ({...prev, country: ""}))}
        >
          <option value="">Select a country</option>
          {country.map((con:any) => (
            <option key={con} value={con}>
              {con}
            </option>
          ))}
        </select>
        {error.country && <p className="text-red-500">{error.country}</p>}
        <label className="font-bold">Education</label>
        <div>
          {inputData.map((data, index) => (
            <div key={index} className='flex flex-col   mb-4'>
              <div className='flex flex-row items-center gap-x-2 '>
              <input 
                type="text" 
                placeholder={`Education detail ${index + 1}`} 
                className={`border-2 px-1 rounded-md min-h-10 w-full ${errorinput.education && 'border-red-500'}`}
                value={data.education}
                onFocus={() => setErrorInput((prev) => ({...prev, education: ""}))}
                onChange={(e) => handleEducationChange(index, e.target.value)}
              />
              {inputData.length !== 1 && (
                <div className='cursor-pointer' onClick={() => removeFields(index)}>Remove</div>
              )}
              </div>
            {errorinput.education && <p className="text-red-500">{errorinput.education}</p>}
            </div>

          ))}
          <h1 className='mt-3 font-medium underline cursor-pointer hover:text-lg' onClick={addFields}>Add +</h1>
        </div>
       { !savechanges ? 
        <div className='flex'>
          <button type="submit" className="h-fit w-fit p-2 bg-green-500 hover:bg-green-600 rounded-md font-bold mt-5">Submit</button>
          <button 
            className="h-fit w-fit p-2  underline  rounded-md font-semibold text-orange-500 hover:text-lg mt-5 ml-2 cursor-pointer"
            onClick={() => router.push("/data")}
          > view submissions</button>

        </div> :  
        <button type="submit" className="h-fit w-fit p-2 bg-orange-500 hover:bg-orange-600 rounded-md font-bold mt-5">Save changes</button> 
       }
      </form>
    </main>
  );
}


