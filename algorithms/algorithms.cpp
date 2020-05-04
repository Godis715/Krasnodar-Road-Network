#include "algorithms.hpp"

extern "C" {
	size_t task_1_1_a(const size_t* _fixed_objects, const size_t f_size, const size_t object,
		const size_t way, const char* file_name)
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

	size_t* task_1_1_b(const size_t* _fixed_objects, const size_t f_size, const size_t object,
		const double max, const size_t way, const char* file_name, size_t& out_size)
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

	size_t task_1_2(const size_t* _fixed_objects, const size_t f_size,
		const size_t* _objects, const size_t o_size,
		const size_t way, const char* file_name)
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

	size_t task_1_3(const size_t* _fixed_objects, const size_t f_size,
		const size_t* _objects, const size_t o_size,
		const size_t way, const char* file_name)
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

	size_t task_1_4(const size_t* _fixed_objects, const size_t f_size,
		const size_t* _objects, const size_t o_size,
		const size_t way, const char* file_name)
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
				auto length = weight_tree_of_shortest_path(dijkstra_path(graph.r_edges, object), objects);
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
				auto length = weight_tree_of_shortest_path(dijkstra_path(graph.edges, object), objects);
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
				auto length = weight_tree_of_shortest_path(dijkstra_path(graph.r_edges, object), objects) +
					weight_tree_of_shortest_path(dijkstra_path(graph.edges, object), objects);
				if (min > length)
				{
					min = length;
					index = object;
				}
			}
			return index;
		}
	}

	void task_2_1(const size_t* _objects, const size_t o_size,
		const size_t object, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		auto pair = tree_of_shortest_path(dijkstra_path(graph.edges, object), objects);
		std::ofstream out(out_file);
		out << pair.second.first << ' ' << pair.second.second << std::endl;
		for (auto edge : pair.first)
			out << edge.first << " " << edge.second << '\n';
		out.close();
	}

	void task_2_2(const size_t* _objects, const size_t o_size,
		const size_t k, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		clustering(k, objects, graph, out_file);
	}

	void task_2_3_out(const vector<int_pair>& tree, const double weight,
		const double length_path, const char* out_file)
	{
		std::ofstream out(out_file, std::ios_base::trunc);
		out.setf(std::ios::fixed);
		out.precision(8);
		out << weight << ' ' << length_path << std::endl;
		for (auto edge : tree)
			out << edge.first << ' ' << edge.second << std::endl;
		out.close();
	}

	void task_2_3_by_clust(const size_t* _objects, const size_t o_size,
		const size_t object, const char* file_name, const char* out_file)
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
		vector<size_t> centroids(k);
		for (size_t i = 0; i < k; ++i)
		{
			size_t c;
			in >> c;
			centroids[i] = c;
		}
		in.close();

		auto distance = dijkstra_path(graph.edges, object);
		auto res = tree_of_shortest_path(distance, centroids);
		res.second.second = 0;

		for (size_t i = 0; i < k; i++)
			if (distance[centroids[i]].first != infinty)
			{
				auto clust_tree = tree_of_shortest_path(dijkstra_path(graph.edges, centroids[i]), clusters[i]);
				res.second.first += clust_tree.second.first;
				res.second.second += clust_tree.second.second + distance[centroids[i]].second;
				res.first.insert(res.first.end(), clust_tree.first.begin(), clust_tree.first.end());
			}
		task_2_3_out(res.first, res.second.first, res.second.second, out_file);
	}

	void task_2_3(const size_t* _objects, const size_t o_size,
		const size_t object, const size_t k, const char* file_name, const char* out_file)
	{
		vector<size_t> objects(_objects, _objects + o_size);
		auto graph = read_data(file_name);
		auto pair = clustering(k, objects, graph);
		auto clusters = pair.first;
		auto centroids = get_centroids(pair.second, graph);

		auto distance = dijkstra_path(graph.edges, object);
		auto res = tree_of_shortest_path(distance, centroids);
		res.second.second = 0;

		for (size_t i = 0; i < k; i++)
			if (distance[centroids[i]].first != infinty)
			{
				auto clust_tree = tree_of_shortest_path(dijkstra_path(graph.edges, centroids[i]), clusters[i]);
				res.second.first += clust_tree.second.first;
				res.second.second += clust_tree.second.second + distance[centroids[i]].second;
				res.first.insert(res.first.end(), clust_tree.first.begin(), clust_tree.first.end());
			}
		task_2_3_out(res.first, res.second.first, res.second.second, out_file);
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

#include "stdlib.h" 
#include <time.h>  

#define ARRAY_ELEM 100000 
int main()
{
	const char* file_name = "graph.txt";
	const size_t length = 4;
	vector<size_t> objects2 = { 14687, 71053, 46221, 48819, 65310, 27971, 46098, 43592, 63179, 49617, 66945, 47714, 34498, 41830, 25327, 39868, 28048, 5305, 34432, 30917, 57026, 58377, 46309, 21787, 18433, 21742, 44433, 55160, 12121, 69789, 16219, 9788, 22613, 4455, 17634, 24638, 4756, 5047, 29979, 17354 };
	vector<size_t> objects = { 14687, 29979, 57026, 46098, 39868, 12121, 41830, 46221, 18433, 17354, 69789, 27971, 43592, 25327, 66945, 49617, 17634, 71053, 21742, 44433, 24638, 55160, 9788, 28048, 47714, 34432, 4756, 22613, 46309, 63179, 58377, 5047, 5305, 16219, 34498, 30917, 48819, 65310, 21787, 4455 };
	auto graph = read_data(file_name);

	for (size_t i = 20; i < objects2.size(); ++i)
		for (size_t j = 0; j < objects.size(); ++j)
			if (objects[j] == objects2[i])
			{
				objects.erase(objects.begin() + j);
				break;
			}
	float fTimeStart = clock() / (float)CLOCKS_PER_SEC;
	for (size_t i = 0; i < 20; ++i)
		//dijkstra_path(graph.edges, 14687);
		//dijkstra_path_fast(graph.edges, 14687, objects);
		dijkstra_path_fast(graph.edges, 14687, objects);
	float fTimeStop = clock() / (float)CLOCKS_PER_SEC;
	printf("tyme %f secund\n", fTimeStop - fTimeStart);
	system("pause");

	//auto objs = new size_t[39];
	//for (size_t i = 1; i < objects.size(); ++i)
	//	objs[i - 1] = objects[i];

	//task_2_2(objs, 40, 8, file_name, "out_file.txt");
	//task_2_3_by_clust(objs, 40, objects[0], file_name, "out_file.txt");
}