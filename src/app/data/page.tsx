// "use client"

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// function page() {

//     const [data, setData] = useState<any[]>([]);

//     const router = useRouter();

//     useEffect(() => {
//         const sumbitedData = localStorage.getItem("formData");
//         console.log(sumbitedData,"sumbitedData")

//         if (sumbitedData) {
//             const parsedArray:string[] = JSON.parse(sumbitedData);
//             setData(parsedArray)
//         }
//     }
//     ,[])

//     const goBack = () => {
//         router.push("/");
//     }

//     const deletedata = (e:any) => {
//         const newData = data.filter((item) => item !== e.target.value);
//         setData(newData);
//         const parsedNewData = newData.map((item) => JSON.parse(item));
//         localStorage.setItem("formData", JSON.stringify(parsedNewData));
//     }


//     return (
//            <div className="bg-blue-300 w-screen h-screen flex flex-col items-center p-7">
//              <div className="bg-white p-7 rounded-lg w-[70%] overflow-auto">
//                 <div className="flex justify-between">
//                 <h1 className="font-bold text-xl mb-3">Your <span className="text-green-600"> SUBMITTED </span>  Details </h1>
//                 <h3 className="underline text-blue-400 cursor-pointer text-2xl" onClick={goBack}>Back</h3>
//                 </div>
//                 {
//                      data.map((item, index) => (
//                      <div key={index} className="mb-3 p-4 border-2 rounded-md">
//                      {Object.keys(item).map((key, subIndex) => (
//                         <div key={subIndex}> 
//                          <h1 ><span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)} : </span>{item[key]}</h1>
//                         </div>
//                      ))}
//                      <div className="flex gap-x-2 items-center mt-2">
//                         <h1 onClick={deletedata} className="h-fit w-fit p-2 bg-red-500 hover:bg-red-700 rounded-md font-semibold text-white">delete</h1>
//                         <h1 className="h-fit w-fit p-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold text-white">edit</h1>
//                      </div>
//                      </div>
//                 ))}
//               </div>
//              </div>
      
//     );
// }

// export default page;
"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
  country: string;
  educations: { education: string }[];
}

export default function DataDisplay() {

  const [data, setData] = useState<FormData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const submittedData = localStorage.getItem("formData");
    if (submittedData) {
      const parsedData: FormData[] = JSON.parse(submittedData);
      setData(parsedData);
    }
  }, []);

  const goBack = () => {
    router.push("/");
  };

  const deleteData = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    localStorage.setItem("formData", JSON.stringify(newData));
  };

  const editData = (index: number) => {
    localStorage.setItem("edit",JSON.stringify(true));
    localStorage.setItem("editIndex",JSON.stringify(index));
    console.log("Edit data at index:", index);
    router.push("/");

  };

  return (
    <div className="bg-blue-300 min-h-screen w-full flex flex-col items-center p-7">
      <div className="bg-white p-7 rounded-lg w-full max-w-4xl overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">
            Your <span className="text-green-600">SUBMITTED</span> Details
          </h1>
          <button
            className="underline text-blue-600 hover:text-blue-800 cursor-pointer text-xl"
            onClick={goBack}
          >
            Back
          </button>
        </div>
        {data.length === 0 ? (
          <p className="text-center text-gray-500">No submitted data yet.</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="mb-6 p-6 border-2 rounded-md shadow-md">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex gap-3">
                  <h2 className="font-semibold">Name:</h2>
                  <p>{item.name}</p>
                </div>
                <div className="flex gap-3">
                  <h2 className="font-semibold">Email:</h2>
                  <p>{item.email}</p>
                </div>
                <div className="flex gap-3">
                  <h2 className="font-semibold">Country:</h2>
                  <p>{item.country}</p>
                </div>
                <div className="flex gap-3">
                  <h2 className="font-semibold">Message:</h2>
                  <p>{item.message}</p>
                </div>
              </div>
              <div className="mt-2">
                <h2 className="font-semibold">Education:</h2>
                <ul className="list-disc list-inside">
                  {item.educations.map((edu, eduIndex) => (
                    <li key={eduIndex}>{edu.education}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-x-2 items-center mt-4">
                <button
                  onClick={() => deleteData(index)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-md font-semibold text-white transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => editData(index)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold text-white transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}