import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AutoPlay from "embla-carousel-autoplay";

const messageSchema = [
  {
    title: "Message from User123",
    content: "Hey, how are you doing today?",
    received: "10 minutes ago",
  },
  {
    title: "Message from SecretAdmirer",
    content: "I really liked your recent post!",
    received: "2 hours ago",
  },
  {
    title: "Message from MysteryGuest",
    content: "Do you have any book recommendations?",
    received: "1 day ago",
  },
];

const Home = () => {
  return (
    <main className="flex-grow flex-col items-center justify-center px-4 md:px-24 py-12 text-black">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          True Feedback - Where identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[AutoPlay({ delay: 2000 })]}
        className="w-full max-w-lg md:max-w-xl"
      >
        <CarouselContent>
          {messageSchema.map((message, index) => (
            <CarouselItem key={index}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{message.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{message.content}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default Home;
