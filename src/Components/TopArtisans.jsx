import Star from '../assets/icons/star-icon.png';
const TopArtisans = () => {
    const artisans = new Array(3).fill({ name: 'Artisan Name', rating: 5 });
  
    return (
      <section className="pt-24 ">
        <h2 className="text-[#110000C2] px-6 text-5xl text-center font-semibold mb-12 ml-12 ">Top Artisans</h2>

        <div className="flex items-center justify-center bg-[#ECF1FC] h-[450px] gap-12 flex-wrap">
          {artisans.map((artisan, idx) => (
            <div key={idx} className="bg-[#A1B7F2] h-[350px] w-[300px] py-6 text-white rounded-2xl items-center justify-items-center p-6 text-center">
              <div className="flex w-24 h-24 mx-auto items-center justify-center rounded-full mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Artisan"
                  className="w-24 h-24 rounded-full object-cover"
              />
              </div>
              <p className="text-lg font-medium mb-2">{artisan.name}</p>
              <p className='text-sm font-normal mb-2'> {artisan.title} </p>

              <div className='flex justify-center gap-1'>
              {Array.from({ length: artisan.rating }, (_, i) => (
                <img key={i} src={Star} alt="Star" className="w-4 h-4 inline-block" />
              ))}
              </div>
              
            </div>
          ))}
        </div>
      </section>
    );
  }
   
  export default TopArtisans;





