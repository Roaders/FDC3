/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
import Layout from "@theme/Layout";
import Container from "../components/Container"
import implData from "../../data/community.json";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import setType from '../components/implementationFilters'

const badgeTitles = {
	"Open Source": "Indicates that the project source code is available to download and modify, under an Apache 2.0 or similar license.",
	"FDC3 1.2 Supported": "Indicates that this product advertises compatibility with the FDC3 1.2 Standard. ",
	"FDC3 2.0 Supported ": "Indicates that this product advertises compatibility with the FDC3 2.0 Standard. ",
	"FDC3 1.2 Compliant": "This badge is applied to desktop agents that have passed the FINOS FDC3 1.2 Conformance testing process.",
	"FDC3 2.0 Compliant": "This badge is applied to desktop agents that have passed the FINOS FDC3 2.0 Conformance testing process."
}

//remove content guidelines
implData.splice(0,1);

//alpha sort implementations
implData.sort((a, b) => {
	const titleA = a.title.toUpperCase(); // ignore upper and lowercase
	const titleB = b.title.toUpperCase(); // ignore upper and lowercase
	if (titleA < titleB) {
		return -1;
	} else if (titleA > titleB) {
		return 1;
	} else {
		return 0;
	}
});


function Implementation({ type, title, publisher, image, infoLink, docsLink, badges, conformance, description }) {
	return <div key={title + type} className={"implementation " + type}>
		<div className="implementation-metadata">
			<div className="title-and-publisher">
				<div className="title">{infoLink ? <a href={infoLink} key={infoLink}>{title}</a> : { title }}</div>
				{publisher ? <div className="publisher">{publisher}</div> : null}
			</div>
			<div className="type">{type}</div>
		</div>
		<div className="implementation-details padding-top--sm padding-bottom--md">
			<div className="implementation-image">
				<img src={image} alt={title} title={title} />
			</div>
			<div className="description">
				<div className="infoLinks">
					{infoLink ? <a href={infoLink} className="button">More info</a> : null}
					{docsLink ? <a href={docsLink} className="button">Documentation</a> : null}
				</div>
				<div className="prose" dangerouslySetInnerHTML={{ __html: description }}></div>
				<div className="conformance">
					{
						conformance ? <h3><a title="The FDC3 Conformance Framework" href="https://github.com/finos/FDC3-Conformance-Framework">Conformance Details</a></h3> : null
					}
					{
						(conformance ? conformance : []).map(c =>
							<div key={c} className="conformance-element">
								<div className="conformance-badge"><img src={c.src} /></div>
								<div className="conformance-text"><ul>
									{
										c.items.map(ti => <li key={ti.link}>{ti.text} { ti.link ? <a className="conformance-details" href={ti.link}>details</a> : "" }</li>)
									}
								</ul></div>
							</div>)
					}
				</div>
				<div className="badges">
					{badges.map(b => <div key={b.text} title={badgeTitles[b.text]} className="button badge">{b.text}</div>)}
				</div>
			</div>
		</div>
	</div>
}

function ImplementationsShowcase(initialFilter) {
	return <div key="is">
		<div className="filters">
			<button className="button filter" id="platform-provider" onClick={() => setType("platform-provider")}>
				Platform Providers
			</button>
			<button className="button filter" id="application-provider" onClick={() => setType("application-provider")}>
				App Providers
			</button>
			<button className="button filter" id="solution-provider" onClick={() => setType("solution-provider")}>
				Solution Providers
			</button>
			<button className="button filter" id="adopter" onClick={() => setType("adopter")}>
				Adopters
			</button>
			<button className="button filter" id="examples-and-training" onClick={() => setType("tools-and-training")}>
				Tools &amp; Training
			</button>
			<button className="button filter" id="demos" onClick={() => setType("demos")}>
				Demos
			</button>
			<button className="button filter" id="meetup" onClick={() => setType("other")}>
				Other
			</button>
			<button className="button filter" id="all" onClick={() => setType("all")}>
				All
			</button>
		</div>
		<div className="implementations">
			{implData.map(impl => (
				<Implementation key={impl.title} {...impl} />
			))}
		</div>
	</div>
}

export default (props) => {
	const context = useDocusaurusContext();
	const siteConfig = context.siteConfig;
	const editUrl = `${siteConfig.customFields.repoUrl}/edit/main/website/data/community.json`;

	return <Layout>
		<Container>
			<h1>FDC3 Community</h1>
			<div className="prose">
				<p>
					The Financial Desktop Connectivity and Collaboration Consortium (FDC3) standard is maintained and used by leading organizations across the financial industry through a variety of different implementations.
				</p>
				<p>
					For more detail on who's implementing the Desktop Agent (a "Platform Provider"), using FDC3 to enable interop with their apps (an "App Provider") or details on where to find demos, examples apps, training materials and other resources, see below.
				</p>
				<p>
					<small>
						<i>
							Disclaimer: Please note that the majority of platforms, applications and content listed below are not affiliated with, supported, or otherwise maintained by FINOS or the FDC3 project and its maintainers. Please contact the publisher of each entry for more information.
						</i>
					</small>
				</p>
				<p>
					<i>
						<strong>Are you using FDC3?</strong>
						<a href={editUrl} className="button">
							Add your details
						</a>
					</i>
				</p>
			</div>

			<ImplementationsShowcase initialFilter={"all"} />
		</Container>
	</Layout>
}


