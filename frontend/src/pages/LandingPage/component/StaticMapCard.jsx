// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function StaticMapCard({
//   title = "Interactive Map Preview",
//   to = "/map",
//   srcWebp = "./mapView.png",
//   srcAvif = "/map_preview.avif",
//   srcFallback = "/mapView.png",
//   height = 400,
// }) {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="p-3 bg-white rounded-4 shadow-xl border border-gray-100 w-100 position-relative"
//       style={{ maxWidth: 600, height, overflow: "hidden", cursor: "pointer" }}
//       onClick={() => navigate(to)}
//       aria-label={`${title}. Click to open full map.`}
//       role="button"
//     >
//       <picture>
//         {srcAvif && <source srcSet={srcAvif} type="image/avif" />}
//         {srcWebp && <source srcSet={srcWebp} type="image/webp" />}
//         <img
//           src={srcFallback}
//           alt={title}
//           loading="lazy"
//           className="w-100 h-100 rounded-3"
//           style={{ objectFit: "cover", display: "block" }}
//         />
//       </picture>

//       <div
//         className="position-absolute start-0 end-0 bottom-0 p-3"
//         style={{
//           background:
//             "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 100%)",
//         }}
//       >
//         <div className="d-flex align-items-center text-white gap-2">
//           <i className="bi bi-geo-alt-fill" aria-hidden="true" />
//           <span className="fw-semibold">{title}</span>
//           <span className="ms-auto small d-none d-sm-inline">Open map</span>
//           <i className="bi bi-arrow-right" aria-hidden="true" />
//         </div>
//       </div>

//       <div
//         className="position-absolute inset-0"
//         style={{
//           top: 0,
//           right: 0,
//           bottom: 0,
//           left: 0,
//           transition: "background .2s ease",
//         }}
//       />
//     </div>
//   );
// }