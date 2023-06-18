import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import{ Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import { b64Image } from "~/data/b64Image";
  
const configuration = new Configuration({
      apiKey: env.DALLE_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  async function generateIcon(prompt: string): Promise<string | undefined> {
    if (env.MOCK_DALLE == "true" ){
        return b64Image
    } else {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: "512x512",
            response_format: "b64_json",
          });
          
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
