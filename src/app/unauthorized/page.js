export default function NotFound() {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <img src='/bhima_boy.png' className="lg:h-[200px] h-[100px] mix-blend-multiply"/>
      <h1 className="lg:text-2xl">401 - unauthorized</h1>
      <p className="text-sm lg:text-lg"> You are not authorized to access this page.</p>
    </div>
  );
}
