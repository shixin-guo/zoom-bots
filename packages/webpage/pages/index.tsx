import {  Text,Page } from '@vercel/examples-ui'
import { Chat } from '../components/Chat'

function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3">
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </div>
  )
}
function Layout (props: any) {
  return (
    <div>
      {props.children}
    </div>
  )
}

Home.Layout = Layout

export default Home
