import "./App.css";
import MessageList from "./components/MessageList";

export default function App() {
  return (
    <div className="font-serif bg-[url(https://img.pikbest.com/origin/09/25/44/89upIkbEsT4yK.jpg!w700wp)] p-6 lg:p-20">

      <div className="flex">

        <h1 className="italic text-red-600 text-5xl mb-5">💬 Bitstream</h1>
        <img className="h-6" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW1nNzV4MXF3aGtvMHVpYTQ0OHg1NjZvbGh1dWczMTY0aWI0bnV2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWnDeIKilkwDcrM2VT/giphy.gif" alt="" />

      </div>

      <MessageList />
    </div>
  );
}
