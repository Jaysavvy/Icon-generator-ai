import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import{ Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
  
const configuration = new Configuration({
      apiKey: env.DALLE_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  async function generateIcon(prompt: string): Promise<string | undefined> {
    if (env.MOCK_DALLE = "true" ){
        return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-9BOvHkiD8ni6EG1FqaTun1pZ/user-DAoluL6N78SV4zTCSmjJ7gOg/img-UnFNVUSAIDSTaijhBXvK3NIG.png?st=2023-06-16T21%3A39%3A39Z&se=2023-06-16T23%3A39%3A39Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-16T20%3A51%3A37Z&ske=2023-06-17T20%3A51%3A37Z&sks=b&skv=2021-08-06&sig=lMXdZ7ylVTnmHeScrnJTTONl4i/Q6dM16XSvu03ZpqY%3D"
    } else {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: "512x512",
            response_format: "b64_json",
          });
          console.log("---")
          console.log(response.data.data[0]?.b64_json)
          console.log("---")
          return response.data.data[0]?.b64_json;
    }
  }

export const generateRouter = createTRPCRouter({
    generateIcon: protectedProcedure
    .input(
        z.object({
            prompt: z.string(),
        })
    ).mutation( async ({ctx, input}) =>{

        // TODO: Verify the user has enough credits 
        const {count} = await ctx.prisma.user.updateMany({
            where: {
                id: ctx.session.user.id,  // TODO: replace with a real id
                credits: {
                    gte: 1,
                },  
            },
            data:{
                credits: {
                    decrement: 1,
                }
            }
        });

        if (count <= 0){
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You do not have enough credits'
            })
        }

          const base64EncodedImage = await generateIcon(input.prompt)

          //TODO: save the images to the s3 bucket 

        return {
            imageUrl: base64EncodedImage,
        };
    }), 
});
