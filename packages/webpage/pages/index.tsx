import { Layout, Page, Text } from "@vercel/examples-ui";

import { Chat } from "../components/Chat";

function Home(): JSX.Element {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-3">
        {/* <Text variant="h2">ChatBot:</Text> */}
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </Page>
  );
}

Home.Layout = Layout;

export default Home;
