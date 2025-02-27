import { gql } from 'graphql-request'

/**
 * This is the schema for the GraphQL API.
 * @public
 */
const typeDefs = gql`
	type Doctype {
		id: ID!
		name: String!
		workflow: String!
		schema: String!
		actions: String!
	}

	type DoctypeField {
		id: ID!
		label: String!
		fieldtype: String
		component: String
		required: Boolean
		readonly: Boolean
	}

	type DoctypeWorkflow {
		name: String!
		machine: StateMachine!
	}

	type StateMachine {
		id: ID!
	}

	type DoctypeAction {
		eventName: String!
		callback: String
	}

	type Query {
		getMeta(doctype: String!): Doctype # ∪ error
		getRecords(doctype: String!, filters: [String]): [String] # ∪ error
		getRecord(doctype: String!, id: ID!): String # ∪ error
	}

	type Mutation {
		runAction(doctype: String!, id: [ID!]!, functionName: String!): [String!]! # ∪ error
	}

	schema {
		query: Query
		mutation: Mutation
	}
`

export default typeDefs
