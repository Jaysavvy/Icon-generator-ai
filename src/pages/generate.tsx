/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { type NextPage } from "next";
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from "next/head";
import {useState} from 'react'

import {Input} from "~/component/input"
import { FormGroup } from "~/component/FormGroup";
import {Button} from "~/component/Button"
import Image from 'next/image'

import { api } from '~/utils/api';



const GeneratePage: NextPage = () => {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    prompt: "",
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
    generateIcon.mutate({
      prompt: form.prompt
    })
    setForm({prompt: ""});
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

  const isLoggedIn = !!session.data;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {!isLoggedIn && 
        <Button onClick={()=> {
          signIn().catch(console.error)
          }}>
            Login
            </Button>
          }
          {isLoggedIn && 
        <Button onClick={()=> {
          signOut().catch(console.error)
          }}>
            Logout
            </Button>
          }
          {session.data?.user.name}
        <form className="flex flex-col gap-4" 
        onSubmit={handleFormSubmit}
        >
            <FormGroup>
            <label>Prompt</label>
              <Input
                value={form.prompt}
                onChange ={updateForm("prompt")}>
              </Input>
            </FormGroup>
            <button className= "bg-blue-400 px-4 py-2 rounded hover:bg-blue-500">Submit</button>
        </form>

        <img src={`data:image/png;base64, ${imageUrl}`}
        alt= "an image of your generated prompt"
        width="100"
        height="100"
        />       
      </main>
    </>
  );
};

export default GeneratePage;

