import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import star from "../../assets/client images/client-home/Star 5.png";
import upload from "../../assets/client images/client-home/uploads.png";


const ReviewRating = () => {

  const REVIEW_API = import.meta.env.VITE_REVIEW_API_BASE_URL;

const { user, token } = useAuth();

const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(false);

const [reviewText, setReviewText] = useState("");
const [selectedRating, setSelectedRating] = useState(0);

const [selectedOrder, setSelectedOrder] = useState(null);

useEffect(() => {

if (
reviews.length &&
!selectedOrder
) {

setSelectedOrder({

orderId:
reviews[0]?.orderId,

artisanId:
reviews[0]?.artisanId,

serviceId:
reviews[0]?.serviceId,

});

}

},[
reviews
]);

const [submitting, setSubmitting] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);

const fetchReviews = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `${REVIEW_API}/reviews/reviews?page=1&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message);
    }

    const allReviews =
      Array.isArray(data?.data)
        ? data.data
        : [];

    // only current client's reviews

    const mine =
      allReviews.filter(
        (r) =>
          r.clientId === user?.id
      );

    setReviews(mine);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (token && user?.id) {
    fetchReviews();
  }
}, [token, user]);

const stats = useMemo(() => {
  const given = reviews.length;

  const average =
    reviews.length
      ? (
          reviews.reduce(
            (a, b) =>
              a +
              (
                b.artisanRating ||
                0
              ),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return {
    given,
    average,
  };
}, [reviews]);

const submitReview = async () => {

if (!selectedOrder) {
alert(
"Select an order"
);

return;
}

if (
!reviewText.trim()
) {
alert(
"Write review"
);

return;
}

try {

setSubmitting(true);

const payload = {

orderId:
selectedOrder.orderId,

artisanId:
selectedOrder.artisanId,

serviceId:
selectedOrder.serviceId,

comment:
reviewText,

artisanRating:
selectedRating,

serviceRating:
selectedRating,

ratingDimensions: {

quality:
selectedRating,

professionalism:
selectedRating,

communication:
selectedRating,

punctuality:
selectedRating,

},

};

const res =
await fetch(

`${REVIEW_API}/reviews/submitReview`,

{

method:
"POST",

headers:{

Authorization:
`Bearer ${token}`,

"Content-Type":
"application/json",

},

body:
JSON.stringify(
payload
),

}

);

const data =
await res.json();

if (!res.ok) {

throw new Error(

data?.message ||

"Review failed"

);

}

alert(
"You earned 50 Fixpoints 🎉"
);

setReviewText("");

setSelectedRating(0);

setShowReviewModal(false);

fetchReviews();

}
catch(err){

console.log(err);

alert(
err.message
);

}
finally{

setSubmitting(false);

}

};

const renderStars = (value = 0) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((num) => (
      <img
        key={num}
        src={star}
        alt=""
        className={`w-6 h-6 ${
          num <= value ? "" : "opacity-30"
        }`}
      />
    ))}
  </div>
);

  return (
    <div className="w-full bg-white">
      <section className="w-full py-14">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-black">
              Reviews & Ratings
            </h1>
            <p className="text-sm text-black mt-1">
              Manage your feedback and ratings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#F1F1F1] rounded-lg p-6">
              <p className="text-sm text-black">Reviews Given</p>
              <h2 className="text-3xl font-semibold text-black mt-2">{stats.given}</h2>
            </div>

            <div className="bg-[#F1F1F1] rounded-lg p-6 ">
              <p className="text-sm text-black">Reviews Received</p>
              <h2 className="text-3xl font-semibold text-black mt-2 mb-4">{stats.received || "0"}</h2>
            </div>

            <div className="bg-[#F1F1F1] rounded-lg p-6">
              <p className="text-sm text-black">Average Rating</p>
              <h2 className="text-3xl font-semibold text-black mt-2">{stats.average}</h2>
            </div>
          </div>

      
          <div className="mb-10">
           <button
  onClick={() => setShowReviewModal(true)}
  className="bg-[#3E83C4] text-white px-7 py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
>
  Leave a Review
</button>

          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{loading && (
<div>
Loading reviews...
</div>
)}

{!loading &&
reviews.length === 0 && (
<div className="text-gray-500">
No reviews yet
</div>
)}

{reviews.map((review) => (

<div
key={review.id}
className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg"
>

<div className="flex justify-between">

<div className="flex gap-4">

<div className="w-12 h-12 rounded-full bg-[#3E83C4] text-white flex items-center justify-center">

{
(
review.comment?.[0] ||
"R"
).toUpperCase()
}

</div>

<div>

<p className="font-semibold text-lg">

Order

{" "}

{review.orderId?.slice(0,8)}

</p>

<p className="text-sm text-gray-500">

Service:

{" "}

{review.serviceId?.slice(0,8)}

</p>

<div className="mt-3">

{
renderStars(
review.artisanRating
)
}

</div>

<p className="mt-4 text-sm">

{
review.comment
}

</p>

</div>

</div>

<div className="text-sm text-gray-400">

{
new Date(
review.date
).toLocaleDateString()
}

</div>

</div>

</div>

))}

</div>
        </div>
      </section>

    
{showReviewModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
)}


{showReviewModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">


      <button
        onClick={() => setShowReviewModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        ✕
      </button>


      <h2 className="text-lg font-semibold text-black mb-1">
        Leave a Review
      </h2>
      <p className="text-sm text-gray-800 mb-6">
        Share your experience with the artisan's service
      </p>

    
      <div className="mb-6">
        <p className="text-sm font-medium text-black mb-2">Rating</p>

       <div className="flex gap-2">

{[1,2,3,4,5].map((num)=>(

<button
key={num}
type="button"
onClick={() =>
setSelectedRating(num)
}
>

<img
src={star}
alt=""
className={`w-8 h-8 ${
selectedRating >= num
? ""
: "opacity-30"
}`}
/>

</button>

))}

</div>
      </div>

      
      <div className="mb-6">
        <p className="text-sm font-medium text-black mb-2">Your Review</p>
       <textarea
value={reviewText}
onChange={(e)=>
setReviewText(
e.target.value
)}
placeholder="Share details of your experience..."
className="w-full border border-gray-300 rounded-lg p-4 h-32 resize-none outline-none"
/>
      </div>


      <div className="mb-6">
        <p className="text-sm font-medium text-black mb-2">
          Photos (Optional)
        </p>

        <button className="w-full flex items-center justify-center gap-2 bg-[#3E83C4] text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition cursor-pointer">
          <img src={upload} alt="upload" className="w-6 h-6" />
          Upload Photos
        </button>
      </div>

      <button
onClick={submitReview}
disabled={
submitting ||
!selectedRating
}
className="
w-full
bg-[#3E83C4]
text-white
py-3
rounded-lg
disabled:opacity-50
"
>

{
submitting
? "Submitting..."
: "Submit Review"
}

</button>

    </div>
  </div>
)}

    </div>
  );
};

export default ReviewRating;
