import { Container, Title } from "@mantine/core";
import { Camera } from "./Camera";

export default function Home() {
  return (
    <main>
      <Title ta="center" m="xl">
        Camera Web
      </Title>
      <Camera />
    </main>
  );
}
