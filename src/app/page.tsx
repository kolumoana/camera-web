import { Container, Space } from "@mantine/core";
import { Camera } from "./Camera";

export default function Home() {
  return (
    <main>
      <Container>
        <Space h="xl" />
        <Camera />
      </Container>
    </main>
  );
}
