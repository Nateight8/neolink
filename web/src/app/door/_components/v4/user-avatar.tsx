export default function UserAvatar() {
  return (
    <div className="h-screen w-full gap-6 flex items-center flex-col justify-center">
      <div className="relative w-full my-8">
        <div className="h-8 flex absolute top-0 w-full left-8 items-center">
          <p className="ml-2 text-xs text-nowrap text-muted-foreground">
            John Wick
          </p>
        </div>
        <div className="rounded-full size-8 bg-muted"></div>
        <div className="absolute w-8  flex items-center justify-end top-8 left-0">
          <div className="h-10 w-4 border-b border-l  hover:border-foreground" />
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute w-8  flex items-center justify-end top-0 left-8">
          <div className="h-10 w-4 border-b border-l  hover:border-foreground" />
        </div>
        <div className="rounded-full size-8 bg-muted"></div>
      </div>
    </div>
  );
}
