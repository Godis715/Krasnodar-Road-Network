#include "algorithms.hpp"

extern "C" {
	size_t task_1_1_a(size_t* _fixed_objects, size_t f_size, size_t object,
		size_t way, const char* file_name)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		auto graph = read_data(file_name);

		if (way == 1)
		{
			reverse_graph(graph);
			auto from_fixed_objects = dijkstra(graph.r_edges, object);
			double dist = double_infinty;
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
			double dist = double_infinty;
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
			reverse_graph(graph);
			auto from_fixed_objects = dijkstra(graph.r_edges, object);
			auto to_fixed_objects = dijkstra(graph.edges, object);
			double dist = double_infinty;
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
		double max, size_t way, const char* file_name, size_t& out_size)
	{
		vector<size_t> fixed_objects(_fixed_objects, _fixed_objects + f_size);
		auto graph = read_data(file_name);
		

		auto res = new size_t[f_size];
		size_t* i = res;
		out_size = 0;

		if (way == 1)
		{
			reverse_graph(graph);
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
			reverse_graph(graph);
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
			double min_to = double_infinty;
			size_t index_to = -1;
			for (size_t i : fixed_objects)
			{
				double max = 0;
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
			double min_from = double_infinty;
			size_t index_from = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				double max = 0;
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
			for (size_t object : objects)
				to_fixed_objects.push_back(dijkstra(graph.edges, object));
			for (size_t object : fixed_objects) 
				from_fixed_objects.push_back(dijkstra(graph.edges, object));
			double min_to_from = double_infinty;
			size_t index_to_from = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				double max = 0;
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
			auto min = double_infinty;
			size_t index = -1;
			for (size_t i : fixed_objects)
			{
				double sum = 0;
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
			double min = double_infinty;
			size_t index = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				double sum = 0;
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
			for (size_t object : objects)
				to_fixed_objects.push_back(dijkstra(graph.edges, object));
			for (size_t object : fixed_objects)
				from_fixed_objects.push_back(dijkstra(graph.edges, object));
			double min = double_infinty;
			size_t index = -1;
			for (size_t i = 0; i < fixed_objects.size(); ++i)
			{
				double sum = 0;
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
			double min = double_infinty;
			size_t index = -1;
			reverse_graph(graph);
			for (size_t object : fixed_objects)
			{
				auto length = lenght_tree_of_shortest_path(dijkstra_path(graph.r_edges, object), objects);
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
			double min = double_infinty;
			size_t index = -1;
			for (size_t object : fixed_objects)
			{
				auto length = lenght_tree_of_shortest_path(dijkstra_path(graph.edges, object), objects);
				if (min > length)
				{
					min = length;
					index = object;
				}
			}
			return index;
		}
		else {
			double min = double_infinty;
			size_t index = -1;
			reverse_graph(graph);
			for (size_t object : fixed_objects)
			{
				auto length = lenght_tree_of_shortest_path(dijkstra_path(graph.r_edges, object), objects) +
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
			out << edge.first << " " << edge.second << '\n';
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
		out << length << std::endl;
		for (auto edge : tree)
			out << edge.first << ' ' << edge.second << std::endl;
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
	
	vector<size_t> obj = { 14687, 29979, 57026, 46098, 39868, 12121, 41830, 46221, 18433, 17354, 69789, 27971, 43592, 25327, 66945, 49617, 17634, 71053, 21742, 44433, 24638, 55160, 9788, 28048, 47714, 34432, 4756, 22613, 46309, 63179, 58377, 5047, 5305, 16219, 34498, 30917, 48819, 65310, 21787, 58655, 4455, 64519, 36783, 38047, 353, 50420, 62254, 68702, 36948, 21360, 21500, 34173, 46377, 28448, 41242, 67839, 27362, 68836, 57515, 43056, 62395, 71083, 43521, 38429, 12420, 63785, 14804, 70314, 59321, 50445, 69228, 56143, 5858, 2546, 21002, 24663, 59726, 10642, 27788, 7261, 54149, 23460, 21444, 58012, 60084, 24133, 64154, 30359, 11692, 11695, 23376, 51317, 24679, 66676, 44524, 65372, 70505, 7059, 20618, 4859 };
	vector<size_t> _fix_obj;
	while (!file.eof())
	{
		size_t x;
		file >> x;
		_fix_obj.push_back(x);
	}
	file.close();
	auto fix_obj = new size_t[_fix_obj.size()];
	for (size_t i = 0; i < _fix_obj.size(); ++i)
		fix_obj[i] = _fix_obj[i];

	for (size_t i = 0; i < obj.size(); ++i)
	{
		auto u = task_1_1_a(fix_obj, _fix_obj.size(), obj[i], 2, file_name);
		std::cout << u << std::endl;
	}
}