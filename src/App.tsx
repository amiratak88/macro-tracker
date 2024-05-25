import { type Signal, createSignal, type VoidComponent, createEffect, Accessor } from "solid-js";
import { omit } from "./utils";

type Macros = {
	calories: number;
	protein: number;
	fat: number;
	carbs: number;
};

const App: VoidComponent = () => {
	const [calroies, setCalories] = createSignal(0);
	const [protein, setProtein] = createSignal(0);
	const [fat, setFat] = createSignal(0);
	const [carbs, setCarbs] = createSignal(0);
	const [library, setLibrary] = createSignal<Record<string, Macros>>({
		egg: { calories: 70, protein: 6, fat: 5, carbs: 1 },
	});

	createEffect(() => {
		console.log("library:", library());
	});

	const addMacros = (macros: Macros) => {
		setCalories(calroies() + macros.calories);
		setProtein(protein() + macros.protein);
		setFat(fat() + macros.fat);
		setCarbs(carbs() + macros.carbs);
	};

	return (
		<div class="w-full h-full bg-teal-700">
			<div>
				<p>⚡️ {calroies()}</p>
				<p>🥩 {protein()}</p>
				<p>🐷 {fat()}</p>
				<p>🥖 {carbs()}</p>
			</div>

			<NewEntryForm
				onSubmit={(props) => {
					const macros = omit(props, "name");

					addMacros(macros);

					if (props.name) {
						setLibrary({ ...library(), [props.name]: omit(props, "name") });
					}
				}}
			/>

			<Library
				library={library}
				onItemClick={(itemName) => {
					if (itemName in library()) {
						addMacros(library()[itemName]);
					}
				}}
			/>
		</div>
	);
};

const NewEntryForm: VoidComponent<{ onSubmit: (props: Macros & { name: string }) => void }> = ({ onSubmit }) => {
	const [name, setName] = createSignal("");
	const [calories, setCalories] = createSignal(0);
	const [protein, setProtein] = createSignal(0);
	const [fat, setFat] = createSignal(0);
	const [carbs, setCarbs] = createSignal(0);

	createEffect(() => {
		console.log("calories:", calories(), ", protein:", protein(), ", fat:", fat(), ", carbs:", carbs());
	});

	const reset = () => {
		setName("");
		setCalories(0);
		setProtein(0);
		setFat(0);
		setCarbs(0);
	};

	return (
		<form
			class="flex w-full justify-between"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({ name: name(), calories: calories(), protein: protein(), fat: fat(), carbs: carbs() });
				if (name()) reset();
			}}
		>
			<TextField label="Name" signal={[name, setName]} />
			<NumberField label="⚡️" signal={[calories, setCalories]} />
			<NumberField label="🥩" signal={[protein, setProtein]} />
			<NumberField label="🐷" signal={[fat, setFat]} />
			<NumberField label="🥖" signal={[carbs, setCarbs]} />

			<button type="submit">Add</button>
			<button type="button" onClick={reset}>
				Reset
			</button>
		</form>
	);
};

const TextField: VoidComponent<{ label: string; signal: Signal<string> }> = ({ label, signal: [value, setValue] }) => {
	return (
		<label>
			{label}
			<input class="w-9 ml-1" type="text" value={value()} onChange={(e) => setValue(e.currentTarget.value)} />
		</label>
	);
};

const NumberField: VoidComponent<{ label: string; signal: Signal<number> }> = ({
	label,
	signal: [value, setValue],
}) => {
	return (
		<label>
			{label}
			<input class="w-5 ml-1" type="number" value={value()} onChange={(e) => setValue(Number(e.currentTarget.value))} />
		</label>
	);
};

const Library: VoidComponent<{
	library: Accessor<Record<string, Macros>>;
	onItemClick: (itemName: string) => void;
}> = ({ library, onItemClick }) => {
	return (
		<div class="flex flex-wrap gap-2">
			{Object.keys(library()).map((itemName) => (
				<button onClick={() => onItemClick(itemName)}>{itemName}</button>
			))}
		</div>
	);
};

export default App;
