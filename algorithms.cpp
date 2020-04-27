#include "algorithms.hpp"

extern "C" {
	size_t task_1_1_a(size_t* _fixed_objects, size_t f_size, size_t object,
		size_t way, const char* file_name)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		auto graph = read_data(file_name);
		reverse_graph(graph);

		if (way == 1)
		{
			auto from_fixed_objects = dijkstra(graph.r_edges, object);
			size_t dist = infinty;
			size_t index = -1;
			for (size_t obj : fixed_objects)
				if (dist >= from_fixed_objects[obj])
				{
					dist = from_fixed_objects[obj];
					index = obj;
				}
			return index;
		}
		else if (way == 2)
		{
			auto to_fixed_objects = dijkstra(graph.edges, object);
			size_t dist = infinty;
			size_t index = -1;
			for (size_t obj : fixed_objects)
				if (dist >= to_fixed_objects[obj])
				{
					dist = to_fixed_objects[obj];
					index = obj;
				}
			return index;
		}
		else
		{
			auto from_fixed_objects = dijkstra(graph.r_edges, object);
			auto to_fixed_objects = dijkstra(graph.edges, object);
			size_t dist = infinty;
			size_t index = -1;
			for (size_t obj : fixed_objects)
				if (dist >= to_fixed_objects[obj] + from_fixed_objects[obj])
				{
					dist = to_fixed_objects[obj] + from_fixed_objects[obj];
					index = obj;
				}
			return index;
		}
	}

	size_t* task_1_1_b(size_t* _fixed_objects, size_t f_size, size_t object,
		size_t max, size_t way, const char* file_name, size_t& out_size)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		auto graph = read_data(file_name);
		reverse_graph(graph);

		auto res = new size_t[f_size];
		size_t* i = res;
		out_size = 0;

		if (way == 1)
		{
			auto from_fixed_objects = dijkstra(graph.r_edges, object);
			for (size_t obj : fixed_objects)
				if (max >= from_fixed_objects[obj])
				{
					*i = obj;
					++i;
					out_size++;
				}
			return res;
		}
		else if (way == 2)
		{
			auto to_fixed_objects = dijkstra(graph.edges, object);
			for (size_t obj : fixed_objects)
				if (max >= to_fixed_objects[obj])
				{
					*i = obj;
					++i;
					out_size++;
				}
			return res;
		}
		else
		{
			auto from_fixed_objects = dijkstra(graph.r_edges, object);
			auto to_fixed_objects = dijkstra(graph.edges, object);
			for (size_t obj : fixed_objects)
				if (max >= to_fixed_objects[obj] + from_fixed_objects[obj])
				{
					*i = obj;
					++i;
					out_size++;
				}
			return res;
		}
	}

	size_t task_1_2(size_t* _fixed_objects, size_t f_size,
		size_t* _objects, size_t o_size,
		size_t way, const char* file_name)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);

		vector<vector<double>> to_fixed_objects;
		vector<vector<double>> from_fixed_objects;

		if (way == 1)
		{
			for (size_t object : objects)
				to_fixed_objects.push_back(dijkstra(graph.edges, object));
			size_t min_to = infinty;
			size_t index_to = -1;
			for (size_t i : fixed_objects)
			{
				size_t max = 0;
				for (auto& to_fixed_object : to_fixed_objects)
					max = max_value(max, to_fixed_object[i]);
				if (max < min_to)
				{
					min_to = max;
					index_to = i;
				}
			}
			return index_to;
		}
		else if (way == 2) {
			for (size_t object : fixed_objects)
				from_fixed_objects.push_back(dijkstra(graph.edges, object));
			size_t min_from = infinty;
			size_t index_from = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				size_t max = 0;
				for (size_t object : objects)
					max = max_value(max, from_fixed_objects[i][object]);
				if (max < min_from)
				{
					min_from = max;
					index_from = fixed_objects[i];
				}
			}
			return index_from;
		}
		else {
			for (size_t object : objects) {
				to_fixed_objects.push_back(dijkstra(graph.edges, object));
				from_fixed_objects.push_back(dijkstra(graph.edges, object));
			}
			size_t min_to_from = infinty;
			size_t index_to_from = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				size_t max = 0;
				for (size_t j = 0; j < objects.size(); ++j)
					max = max_value(max, from_fixed_objects[i][objects[j]] + to_fixed_objects[j][fixed_objects[i]]);
				if (max < min_to_from)
				{
					min_to_from = max;
					index_to_from = fixed_objects[i];
				}
			}
			return index_to_from;
		}
	}

	size_t task_1_3(size_t* _fixed_objects, size_t f_size,
		size_t* _objects, size_t o_size,
		size_t way, const char* file_name)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);

		vector<vector<double>> to_fixed_objects;
		vector<vector<double>> from_fixed_objects;

		if (way == 1)
		{
			for (size_t object : objects)
				to_fixed_objects.push_back(dijkstra(graph.edges, object));
			size_t min = infinty;
			size_t index = -1;
			for (size_t i : fixed_objects)
			{
				size_t sum = 0;
				for (auto& to_fixed_object : to_fixed_objects)
					sum += to_fixed_object[i];
				if (sum < min)
				{
					min = sum;
					index = fixed_objects[i];
				}
			}
			return index;
		}
		else if (way == 2) {
			for (size_t object : fixed_objects)
				from_fixed_objects.push_back(dijkstra(graph.edges, object));
			size_t min = infinty;
			size_t index = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				size_t sum = 0;
				for (size_t object : objects)
					sum += from_fixed_objects[i][object];
				if (sum < min)
				{
					min = sum;
					index = fixed_objects[i];
				}
			}
			return index;
		}
		else {
			for (size_t object : objects) {
				to_fixed_objects.push_back(dijkstra(graph.edges, object));
				from_fixed_objects.push_back(dijkstra(graph.edges, object));
			}
			size_t min = infinty;
			size_t index = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				size_t sum = 0;
				for (size_t j = 0; j < objects.size(); ++j)
					sum += from_fixed_objects[i][objects[j]] + to_fixed_objects[j][fixed_objects[i]];
				if (sum < min)
				{
					min = sum;
					index = fixed_objects[i];
				}
			}
			return index;
		}
	}

	size_t task_1_4(size_t* _fixed_objects, size_t f_size,
		size_t* _objects, size_t o_size,
		size_t way, const char* file_name)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);

		if (way == 1)
		{
			size_t min = infinty;
			size_t index = -1;
			reverse_graph(graph);
			for (size_t object : fixed_objects)
			{
				double length = lenght_tree_of_shortest_path(dijkstra_path(graph.r_edges, object), objects);
				if (min > length)
				{
					min = length;
					index = object;
				}
			}
			return index;
		}
		else if (way == 2)
		{
			size_t min = infinty;
			size_t index = -1;
			for (size_t object : fixed_objects)
			{
				double length = lenght_tree_of_shortest_path(dijkstra_path(graph.edges, object), objects);
				if (min > length)
				{
					min = length;
					index = object;
				}
			}
			return index;
		}
		else {
			size_t min = infinty;
			size_t index = -1;
			reverse_graph(graph);
			for (size_t object : fixed_objects)
			{
				double length = lenght_tree_of_shortest_path(dijkstra_path(graph.r_edges, object), objects) +
					lenght_tree_of_shortest_path(dijkstra_path(graph.edges, object), objects);
				if (min > length)
				{
					min = length;
					index = object;
				}
			}
			return index;
		}
	}

	void task_2_1(size_t* _objects, size_t o_size,
		size_t object, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		auto distance = dijkstra_path(graph.edges, object);
		auto pair = length_and_tree_of_shortest_path(distance, objects);
		std::ofstream out(out_file);
		out << pair.second << std::endl;
		for (auto edge : pair.first)
			out << edge.first << " " << edge.second << ' ';
	}

	void task_2_2(size_t* _objects, size_t o_size,
		size_t k, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		clustering(k, objects, graph, out_file);
	}

	void task_2_3_out(vector<int_pair> tree, size_t length, const char* out_file)
	{
		std::ofstream out(out_file, std::ios_base::trunc);
		for (auto edge : tree)
			out << edge.first << ' ' << edge.second << ' ';
		out << std::endl << length;
	}

	void task_2_3_by_clust(size_t* _objects, size_t o_size,
		size_t object, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		std::ifstream in(out_file);
		size_t k;
		in >> k;
		vector<vector<size_t>> clusters(k);
		for (size_t i = 0; i < k; ++i)
		{
			size_t size;
			in >> size;
			clusters[i] = vector<size_t>(size);
			for (size_t j = 0; j < size; ++j)
			{
				size_t v;
				in >> v;
				clusters[i][j] = v;
			}
		}
		vector<float_pair> centroids_coord(k);
		for (size_t i = 0; i < k; ++i)
		{
			size_t x, y;
			in >> x >> y;
			centroids_coord[i] = { x, y };
		}
		auto centroids = get_centroids(centroids_coord, graph);

		auto res = length_and_tree_of_shortest_path(dijkstra_path(graph.edges, object), centroids);

		for (size_t i = 0; i < clusters.size(); i++)
		{
			auto clust_tree = length_and_tree_of_shortest_path(dijkstra_path(graph.edges, centroids[i]), clusters[i]);
			res.second += clust_tree.second;
			res.first.insert(res.first.end(), clust_tree.first.begin(), clust_tree.first.end());
		}
		task_2_3_out(res.first, res.second, out_file);
	}

	void task_2_3(size_t* _objects, size_t o_size,
		size_t object, size_t k, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		auto pair = clustering(k, objects, graph);
		auto clusters = pair.first;
		auto centroids = get_centroids(pair.second, graph);

		auto res = length_and_tree_of_shortest_path(dijkstra_path(graph.edges, object), centroids);

		for (size_t i = 0; i < clusters.size(); i++)
		{
			auto clust_tree = length_and_tree_of_shortest_path(dijkstra_path(graph.edges, centroids[i]), clusters[i]);
			res.second += clust_tree.second;
			res.first.insert(res.first.end(), clust_tree.first.begin(), clust_tree.first.end());
		}
		task_2_3_out(res.first, res.second, out_file);
	}

	// A function to free up the memory.
	void free_memory(double* x)
	{
		delete[] x;
	}
}

// 1 from object to fix
// 2 from fix to object
// 3 from and to
int main()
{
	const char* file_name = "graph.txt";
	const size_t length = 4;
	std::ifstream file("objects.txt");
	auto fix_obj = new size_t[length];
	auto obj = new size_t[length];
	for (size_t i = 0; i < length; ++i)
		fix_obj[i] = i;
	for (size_t i = 0; i < length; ++i)
		obj[i] = i + 4;


	auto u = task_1_4(fix_obj, length, obj, length, 1, file_name);
	std::cout << u;
}