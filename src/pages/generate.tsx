/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { type NextPage } from "next";
import { signIn, signOut, useSession } from 'next-auth/react';
import clsx from 'clsx'
import Head from "next/head";
import {useState} from 'react'

import {Input} from "~/component/input"
import { FormGroup } from "~/component/FormGroup";
import {Button} from "~/component/Button"
import Image from 'next/image'

import { api } from '~/utils/api';

const colors =[
  'blue',
  'red',
  'pink',
  'green',
  'orange',
  'yellow',
  'white',
  'black',
]

const GeneratePage: NextPage = () => {


  const [error, setError] = useState("");
  const [form, setForm] = useState({
    prompt: "",
    color: "",
  });

  const [imageUrl, setImagesUrl] = useState('');

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data){
      console.log("mutation finished", data.imageUrl);
      if(!data.imageUrl) return;
      setImagesUrl(data.imageUrl)
    },
    onError(error) {
      setError(error.message);
    },
  
  });

  

  function handleFormSubmit(e: React.FormEvent){
    e.preventDefault();
    // TODO: submit the form data to the backend 
    generateIcon.mutate(form)

  }

 
  function updateForm(key: string){
    return function(e: React.ChangeEvent<HTMLInputElement>){
      setForm ((prev) => ({
        ...prev,
        [key]: e.target.value,
      }))
    }
  }

  const session = useSession();


  return (
    <>
      <Head>
        <title>Generate Icons</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-24 flex min-h-screen flex-col container mx-auto gap-4 px-8">
        <h1 className="text-6xl">Generate your icons</h1>
        <p className="text-2xl mb-12">Fill out the form below to start generating your icons</p>
          {session.data?.user.name}
        <form className="flex flex-col gap-4" 
        onSubmit={handleFormSubmit}
        >
        <h2 className=" text-xl">1. Describe what you want your account to look like</h2>
        <FormGroup className="mb-12">
            <label>Prompt</label>
              <Input
                value={form.prompt}
                onChange ={updateForm("prompt")}>
              </Input>
        </FormGroup>
        <h2 className=" text-xl">2. Pick your Icon color</h2>
        <FormGroup className="grid grid-cols-4">
          {colors.map(color => 
               <label key={color} className="flex gap-2 text-2xl">
            <input 
            type="radio" 
            name="color" 
            value={color}
            checked={color === form.color}
            onChange={()=> setForm((prev) => ({...prev, color}))
            }
            ></input>
              {color}
            </label>
            )}
         
            

        </FormGroup>
            <Button 
            isLoading={generateIcon.isLoading}
            disabled={generateIcon.isLoading}>Submit</Button>
        </form>
        
{imageUrl &&(
  <>
      <h2 className=" text-xl">Your icons</h2>
        <section className="grid grid-cols-4 gap-4 mb-12">
        <Image src={imageUrl}
        alt= "an image of your generated prompt"
        width="100"
        height="100"
        className="w-full"
        />
       </section>
   </> 
        )}   
        
      </main>
    </>
  );
};

export default GeneratePage;

