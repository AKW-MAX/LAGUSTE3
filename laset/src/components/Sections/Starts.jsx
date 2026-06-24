export default function Starts() {
  return (
    <div
      className="
        border rounded-lg
        flex flex-row justify-between items-center
        text-center
        bg-green-900 text-white
        p-2 sm:p-4 md:p-6
        mx-2 sm:mx-5 md:mx-10
		
      "
    >
      <div className="border-r border-white px-2 sm:px-6 md:px-10">
        <p className="font-bold text-sm sm:text-lg md:text-xl">10</p>
        <p className="text-xs sm:text-sm md:text-base font-normal">
          Years <br /> of Experience
        </p>
      </div>

      <div className="border-r border-white px-2 sm:px-6 md:px-10">
        <p className="font-bold text-sm sm:text-lg md:text-xl">5</p>
        <p className="text-xs sm:text-sm md:text-base font-normal">
          Branches <br /> Across the Country
        </p>
      </div>

      <div className="border-r border-white px-2 sm:px-6 md:px-10">
        <p className="font-bold text-sm sm:text-lg md:text-xl">50+</p>
        <p className="text-xs sm:text-sm md:text-base font-normal">
          Expert <br /> Employees
        </p>
      </div>

      <div className="px-2 sm:px-6 md:px-10">
        <p className="font-bold text-sm sm:text-lg md:text-xl">10k+</p>
        <p className="text-xs sm:text-sm md:text-base font-normal">
          Customers <br /> Served
        </p>
      </div>
    </div>
  );
}
