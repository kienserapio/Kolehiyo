const reviews = [
  {
    quote: "I used Kolehiyo to find my dream university — and I didn't miss a single deadline!",
    name: "Elle",
    location: "Quezon City",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    quote: "It made tracking my scholarships and exams so much easier.",
    name: "Andrei",
    location: "Cebu City",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    quote: "Every feature that Kolehiyo had helped me shape my college journey.",
    name: "Kiko",
    location: "Mandaluyong City",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1D5D95' }}>
            Hear It From Our Students
          </h2>
          <p className="text-base md:text-xl lg:text-[24px] text-foreground/70 mb-12 font-medium">
            Real stories from those who found their path through Kolehiyo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div key={index} className="text-center">
          <p className="text-base md:text-xl lg:text-[20px] text-foreground/70 mb-12 font-medium">
                "{review.quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-bold text-foreground">{review.name}</p>
                  <p className="text-[#FBB507] font-medium">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
