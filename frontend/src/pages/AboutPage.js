import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-body-secondary">
      {/* Hero */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-lg-7">
              <h1 className="display-6 fw-bold mb-2">About VolunteerConnect</h1>
              <p className="lead text-secondary mb-3">
                We help people discover meaningful volunteer opportunities that
                match their interests, skills, and schedule—while giving
                nonprofits the tools to mobilize help when it matters most.
              </p>
              <div className="d-flex gap-2">
                <a href="/opportunities" className="btn btn-primary">
                  Find Opportunities
                </a>
                <a href="/community" className="btn btn-outline-secondary">
                  Explore Community
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h5 mb-3">Our Impact (last 12 months)</h2>
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="h3 mb-0">18k</div>
                      <div className="small text-secondary">Hours Logged</div>
                    </div>
                    <div className="col-4">
                      <div className="h3 mb-0">2.1k</div>
                      <div className="small text-secondary">Events</div>
                    </div>
                    <div className="col-4">
                      <div className="h3 mb-0">650+</div>
                      <div className="small text-secondary">Orgs Served</div>
                    </div>
                  </div>
                  <hr />
                  <p className="small mb-0 text-secondary">
                    Data is updated weekly from participating partners and
                    verified volunteer logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission + How it works */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h4">Our Mission</h3>
                  <p className="text-secondary">
                    Make it effortless for anyone to contribute to causes they
                    care about, and give nonprofits a modern platform to recruit,
                    coordinate, and celebrate volunteers.
                  </p>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">• Accessibility first</li>
                    <li className="mb-2">• Safety & verification</li>
                    <li className="mb-2">• Transparent impact tracking</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h4">How VolunteerConnect Works</h3>
                  <ol className="mb-0">
                    <li className="mb-2">
                      Tell us your interests, skills, and availability.
                    </li>
                    <li className="mb-2">
                      Get matched to curated opportunities near you or online.
                    </li>
                    <li className="mb-2">
                      Log hours, earn badges, and see your impact grow.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="row g-4 mt-1">
            {[
              {
                title: "Smart Matching",
                text: "Personalized recommendations based on your profile and history.",
              },
              {
                title: "Impact Dashboard",
                text: "Track hours, milestones, and skills you’ve developed.",
              },
              {
                title: "Org Tools",
                text: "Publish events, manage rosters, and verify volunteer hours.",
              },
            ].map((f, i) => (
              <div className="col-12 col-md-4" key={i}>
                <div className="card h-100">
                  <div className="card-body">
                    <h4 className="h6">{f.title}</h4>
                    <p className="text-secondary mb-0">{f.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <h3 className="h4 mb-4">Meet the Team</h3>
          <div className="row g-4">
            {[
              { name: "Alicia Tan", role: "Product Lead" },
              { name: "Rahul Mehta", role: "Engineering" },
              { name: "Sofia Lim", role: "Partnerships" },
              { name: "Jonas Lee", role: "Design" },
            ].map((m) => (
              <div className="col-6 col-md-3" key={m.name}>
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="rounded-circle bg-body-secondary mx-auto mb-3" style={{width:72,height:72}} />
                    <div className="fw-medium">{m.name}</div>
                    <div className="small text-secondary">{m.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-5">
        <div className="container">
          <h3 className="h4 mb-3">Our Values</h3>
          <div className="row g-3">
            {["Equity", "Trust", "Community", "Learning"].map((v) => (
              <div className="col-6 col-md-3" key={v}>
                <div className="border rounded p-3 text-center bg-white">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
