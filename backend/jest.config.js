module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	testMatch: ['**/test/*.+(ts|tsx|js)']
};
